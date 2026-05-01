import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const OUT_DIR = path.join(process.cwd(), "smoke-report");
const ORIGINAL = "https://corechamps.com";
const LOCAL = process.env.SMOKE_LOCAL_URL || "http://localhost:3000";

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function stripOverlays(page) {
  await page.evaluate(() => {
    const selectors = [
      "#ts-geo",
      "#ts-geo-modal",
      ".klaviyo-form",
      "[data-testid^='klaviyo']",
      "[aria-label='POPUP Form']",
      ".needsclick",
      ".shopify-pc__banner",
      ".shopify-pc__floating-banner",
      ".fancybox-container",
      ".fancybox-overlay",
      "[class*='popup']",
      "[class*='modal']",
      "[id*='popup']",
      "[id*='modal']",
      "iframe[src*='judge']",
      "iframe[src*='klaviyo']",
      "#dummy-chat-button-iframe",
      ".intercom-lightweight-app"
    ];
    selectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        el.remove();
      });
    });

    document
      .querySelectorAll("[id*='klaviyo'],[class*='klaviyo'],[id*='cookie'],[class*='cookie']")
      .forEach((el) => {
        if (el.clientHeight < window.innerHeight * 0.75) {
          el.remove();
        }
      });

    // Remove marketing/signup overlays that can randomly appear on the original site.
    Array.from(document.querySelectorAll("div,section,aside"))
      .filter((el) => {
        const text = (el.textContent || "").toLowerCase();
        if (!text.includes("unlock 10% off") && !text.includes("sign me up")) return false;
        const style = window.getComputedStyle(el);
        return (
          style.position === "fixed" ||
          style.position === "sticky" ||
          Number(style.zIndex || "0") > 200
        );
      })
      .forEach((el) => {
        el.remove();
      });

    document.querySelectorAll("*").forEach((el) => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      const isLargeBlockingLayer =
        (style.position === "fixed" || style.position === "sticky") &&
        Number(style.zIndex || "0") > 500 &&
        rect.width > window.innerWidth * 0.6 &&
        rect.height > window.innerHeight * 0.3;
      if (isLargeBlockingLayer) el.remove();
    });
  });
}

async function takeScreenshot(page, url, file, viewport) {
  await page.setViewportSize(viewport);
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(3000);
  await stripOverlays(page);
  await page.waitForTimeout(500);
  await page.screenshot({ path: file, fullPage: false });
}

function ratioToPct(ratio) {
  return Number((ratio * 100).toFixed(2));
}

async function compareImages(aPath, bPath, outPath) {
  const a = PNG.sync.read(await fs.readFile(aPath));
  const b = PNG.sync.read(await fs.readFile(bPath));
  const width = Math.min(a.width, b.width);
  const height = Math.min(a.height, b.height);
  const diff = new PNG({ width, height });
  const mismatch = pixelmatch(
    a.data,
    b.data,
    diff.data,
    width,
    height,
    {
      threshold: 0.1
    }
  );
  await fs.writeFile(outPath, PNG.sync.write(diff));
  return mismatch / (width * height);
}

async function checkDropdown(page, siteLabel) {
  try {
    await page.goto(siteLabel === "local" ? LOCAL : ORIGINAL, {
      waitUntil: "domcontentloaded",
      timeout: 90000
    });
    await page.waitForTimeout(2500);
    await stripOverlays(page);

    const menuCandidates = [
      'a:has-text("SUPPLEMENTS")',
      'a:has-text("Supplements")',
      'text=SUPPLEMENTS',
      'text=Supplements'
    ];

    let hovered = false;
    for (const selector of menuCandidates) {
      const loc = page.locator(selector).first();
      if ((await loc.count()) > 0) {
        await loc.hover();
        hovered = true;
        break;
      }
    }

    await page.waitForTimeout(900);
    const visibleSubLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll("a"));
      const productLinks = links.filter((a) => {
        const href = a.getAttribute("href") || "";
        const style = window.getComputedStyle(a);
        return (
          href.includes("/products/") &&
          style.visibility !== "hidden" &&
          style.display !== "none" &&
          a.getBoundingClientRect().width > 0
        );
      });
      return productLinks.length;
    });

    return {
      hovered,
      visibleSubLinks
    };
  } catch (error) {
    return { hovered: false, visibleSubLinks: 0, error: String(error) };
  }
}

async function checkProductHover(page, siteLabel) {
  const url = `${siteLabel === "local" ? LOCAL : ORIGINAL}/collections/protein`;
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
    await page.waitForTimeout(2500);
    await stripOverlays(page);

    const selector = 'a[href*="/products/"] img';
    const first = page.locator(selector).first();
    if ((await first.count()) === 0) {
      return { found: false };
    }

    const before = await first.evaluate((el) => getComputedStyle(el).transform);
    await first.hover();
    await page.waitForTimeout(500);
    const after = await first.evaluate((el) => getComputedStyle(el).transform);

    return {
      found: true,
      before,
      after,
      changed: before !== after
    };
  } catch (error) {
    return { found: false, error: String(error) };
  }
}

async function checkHeroMotionLocal(page) {
  try {
    await page.goto(LOCAL, { waitUntil: "domcontentloaded", timeout: 90000 });
    await page.waitForTimeout(2200);
    await stripOverlays(page);

    const getActiveIndex = async () =>
      page.evaluate(() => {
        const slides = Array.from(document.querySelectorAll("section img"));
        if (!slides.length) return -1;
        let best = { idx: -1, area: 0 };
        slides.forEach((img, idx) => {
          const rect = img.getBoundingClientRect();
          const style = window.getComputedStyle(img.parentElement || img);
          const visible =
            rect.top < window.innerHeight &&
            rect.bottom > 0 &&
            rect.width > 200 &&
            rect.height > 120 &&
            Number(style.opacity || "1") > 0.5;
          if (visible) {
            const area = rect.width * rect.height;
            if (area > best.area) best = { idx, area };
          }
        });
        return best.idx;
      });

    const idx1 = await getActiveIndex();
    await page.waitForTimeout(6200);
    const idx2 = await getActiveIndex();
    return {
      firstIndex: idx1,
      secondIndex: idx2,
      changed: idx1 !== idx2 && idx1 !== -1 && idx2 !== -1
    };
  } catch (error) {
    return { changed: false, error: String(error) };
  }
}

async function checkAdminLocal(page) {
  try {
    await page.goto(`${LOCAL}/admin`, {
      waitUntil: "domcontentloaded",
      timeout: 90000
    });
    await page.waitForTimeout(2000);
    const moduleLabels = [
      "Dashboard",
      "Catalog",
      "Content",
      "Design",
      "Marketing",
      "Media",
      "Settings",
      "Users/Roles/Permissions"
    ];

    const visibility = {};
    for (const label of moduleLabels) {
      const loc = page.getByText(label).first();
      visibility[label] = (await loc.count()) > 0;
    }
    return visibility;
  } catch (error) {
    return { error: String(error) };
  }
}

async function run() {
  await ensureDir(OUT_DIR);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const paths = {
    desktopLocal: path.join(OUT_DIR, "desktop-local.png"),
    desktopOriginal: path.join(OUT_DIR, "desktop-original.png"),
    desktopDiff: path.join(OUT_DIR, "desktop-diff.png"),
    mobileLocal: path.join(OUT_DIR, "mobile-local.png"),
    mobileOriginal: path.join(OUT_DIR, "mobile-original.png"),
    mobileDiff: path.join(OUT_DIR, "mobile-diff.png")
  };

  await takeScreenshot(page, LOCAL, paths.desktopLocal, {
    width: 1440,
    height: 2200
  });
  await takeScreenshot(page, ORIGINAL, paths.desktopOriginal, {
    width: 1440,
    height: 2200
  });

  await takeScreenshot(page, LOCAL, paths.mobileLocal, {
    width: 390,
    height: 844
  });
  await takeScreenshot(page, ORIGINAL, paths.mobileOriginal, {
    width: 390,
    height: 844
  });

  const desktopMismatch = await compareImages(
    paths.desktopLocal,
    paths.desktopOriginal,
    paths.desktopDiff
  );
  const mobileMismatch = await compareImages(
    paths.mobileLocal,
    paths.mobileOriginal,
    paths.mobileDiff
  );

  const dropdownLocal = await checkDropdown(await context.newPage(), "local");
  const dropdownOriginal = await checkDropdown(await context.newPage(), "original");
  const hoverLocal = await checkProductHover(await context.newPage(), "local");
  const hoverOriginal = await checkProductHover(await context.newPage(), "original");
  const heroLocal = await checkHeroMotionLocal(await context.newPage());
  const adminLocal = await checkAdminLocal(await context.newPage());

  await browser.close();

  const report = {
    generatedAt: new Date().toISOString(),
    sites: {
      local: LOCAL,
      original: ORIGINAL
    },
    screenshotDiff: {
      desktopMismatchPct: ratioToPct(desktopMismatch),
      mobileMismatchPct: ratioToPct(mobileMismatch),
      files: paths
    },
    interactions: {
      dropdown: {
        local: dropdownLocal,
        original: dropdownOriginal
      },
      productHover: {
        local: hoverLocal,
        original: hoverOriginal
      },
      heroMotionLocal: heroLocal
    },
    adminSmoke: adminLocal
  };

  const jsonPath = path.join(OUT_DIR, "client-smoke-report.json");
  await fs.writeFile(jsonPath, JSON.stringify(report, null, 2));

  const summaryLines = [
    "# Client Smoke Report",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "## Visual Diff",
    `- Desktop mismatch: ${report.screenshotDiff.desktopMismatchPct}%`,
    `- Mobile mismatch: ${report.screenshotDiff.mobileMismatchPct}%`,
    "",
    "## Interaction Checks",
    `- Dropdown local visible sub-links: ${report.interactions.dropdown.local.visibleSubLinks ?? "n/a"}`,
    `- Dropdown original visible sub-links: ${report.interactions.dropdown.original.visibleSubLinks ?? "n/a"}`,
    `- Product hover local changed: ${report.interactions.productHover.local.changed ?? false}`,
    `- Product hover original changed: ${report.interactions.productHover.original.changed ?? false}`,
    `- Local hero auto-motion detected: ${report.interactions.heroMotionLocal.changed ?? false}`,
    "",
    "## Admin Smoke",
    ...Object.entries(report.adminSmoke).map(([k, v]) => `- ${k}: ${v}`)
  ];

  await fs.writeFile(path.join(OUT_DIR, "client-smoke-report.md"), summaryLines.join("\n"));
  console.log(`Report saved: ${jsonPath}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
