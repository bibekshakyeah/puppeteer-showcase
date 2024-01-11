import puppeteer from 'puppeteer';

interface ScrapeProduct {
    name:string;
    identifications: string[];
}

async function scrapeBatch(url: string): Promise<Partial<ScrapeProduct>> {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const result = await page.evaluate(() => {
        const scrapeProduct: Partial<ScrapeProduct> = {};

        // Scrape product name
        const productNameElement = document.querySelector("h1.product_title.entry-title");
        if (productNameElement) {
            scrapeProduct.name = productNameElement.textContent || '';

        }



        return scrapeProduct;
    });

    await browser.close();
    return result;
}

// Call the function with your URL
scrapeBatch('https://bestdealsnepal.com.np/product/1-mtr-lightning-to-usb-cableabs-case/')
    .then(result => console.log('Scraping completed:', result))
    .catch(error => console.error('Error during scraping:', error));
