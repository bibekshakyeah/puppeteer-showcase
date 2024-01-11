import puppeteer from 'puppeteer';

interface StockData {
  name: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  // Add more properties as needed
}

async function importStockPrice(): Promise<void> {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--disable-http2'],
  });  const page = await browser.newPage();
  const url = 'https://www.nepalstock.com/today-price';

  await page.goto(url, { waitUntil: 'networkidle2' });

  // Select the dropdown and change its value
  await page.select('select', '500');
  await page.waitForTimeout(1000);
  // Click on the search button
  await page.click('.box__filter--search');
  await page.waitForNetworkIdle(); // Wait for network idle
  // Wait for the table to load
  await page.waitForSelector('table');

  // Extract the date and data from the table
  const { date, data } = await page.evaluate((): { date: string; data: StockData[] } => {
    const dateElement = document.querySelector('.table__asofdate') as HTMLElement;
    const dateText = dateElement ? dateElement.innerText : '';

    const rows = Array.from(document.querySelectorAll('table tbody tr'));
    const extractedData: StockData[] = rows.map(row => {
      const columns = row.querySelectorAll('td');
      return {
        name: columns[1].innerText,
        openPrice: columns[3].innerText,
        highPrice: columns[4].innerText,
        lowPrice: columns[5].innerText,
        // Extract other columns as needed
      };
    });

    return { date: dateText, data: extractedData };
  });


  console.log(date);
  console.log(data);

  // Add your logic here to process and save the data

  await browser.close();
}

importStockPrice().catch(error => {
  console.error('Error running the import script:', error);
});
