import puppeteer from 'puppeteer';

class AliteqScraper {

    public async scrapeProduct(url: string): Promise<string> {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Example: Scraping product name
        const productName = await page.$eval("h1.product_title", element => element.textContent || '');


        await browser.close();
        return productName;
    }

}

// Example usage
const scraper = new AliteqScraper();
scraper.scrapeProduct('https://www.aliteq.com/buy/newest-hp-spectre-x360-13t-quad-core8th-gen-intel-i7-8550u/')
    .then(product => console.log(product))
    .catch(error => console.error(error));
