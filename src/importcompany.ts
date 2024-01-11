import puppeteer from 'puppeteer';

async function importCompanyList() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--disable-http2'],
  });
  const page = await browser.newPage();
  const url = 'https://www.nepalstock.com/company';

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });

  // Select the dropdown and change its value
  await page.select('div.box__filter--field select', '500');

  // Click on the search button
  await page.click('.box__filter--search');

  // Wait for the table to load
  await page.waitForSelector('table');

  // Extract data from the table
  const companies = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('table tbody tr'));
    return rows.map((row) => {
      const columns = row.querySelectorAll('td');
      return {
        companyName: columns[1]?.textContent,
        symbol: columns[2]?.textContent,
        status: columns[3]?.textContent,
        securityName: columns[4]?.textContent,
        instrumentType: columns[5]?.textContent,
        companyEmail: columns[6]?.textContent,
        website: columns[7]?.textContent,
      };
    });
  });

  console.log(companies);

  await browser.close();
}

importCompanyList().catch(console.error);
