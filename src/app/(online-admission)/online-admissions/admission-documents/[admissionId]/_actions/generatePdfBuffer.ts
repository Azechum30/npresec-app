import chromium from "@sparticuz/chromium-min";
import puppeteer from "puppeteer-core";

export const generatePDFBuffer = async (htmlContent: string) => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false,
      isLandscape: true,
    },
    executablePath: await chromium.executablePath(),
    headless: "shell",
  });

  const page = await browser.newPage();
  page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "20mm", bottom: "20mm", left: "20mm", right: "20mm" },
  });

  await browser.close();

  return pdfBuffer;
};
