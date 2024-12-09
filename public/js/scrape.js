const puppeteer = require('puppeteer');

async function getPrice(productName) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(productName)}&tbm=shop`;

    await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

    try {
        await page.waitForSelector('.sh-dgr__grid-result', { timeout: 5000 });

        const price = await page.$eval('.a8Pemb', el => el.textContent.trim());
        return parseFloat(price.replace('₺', '').replace(' ', '').replace('.', '').replace(',', '.'));
    } catch (error) {
        return null;
    } finally {
        await browser.close();
    }
}

module.exports = { getPrice };
