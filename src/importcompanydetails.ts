import puppeteer from 'puppeteer';

export async function singleSecurityDetail() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--disable-http2'],
  });
  const page = await browser.newPage();

  // Assume securityRepo.findBySid(id) and other repository operations are implemented

  await page.goto(`https://www.nepalstock.com/company/detail/131`, {
    waitUntil: 'networkidle2',
  });

  // Extract data from the table
  await page.evaluate(() => {
    const table = document.querySelector('div.box table.table-striped');
    const rows = Array.from(table.querySelectorAll('tr'));

    const listingDate = rows[2].querySelector('td').textContent;
    const stockListedShares = rows[11].querySelector('td').textContent;
    const paidUpCapital = rows[12].querySelector('td').textContent;
    const marketCapitalization = rows[13].querySelector('td').textContent;

    const ownershipTable = document.querySelector('div#ownership table');
    const ownershipRows = Array.from(ownershipTable.querySelectorAll('tr'));

    const promoterData = ownershipRows[1]
      .querySelector('td')
      .textContent.split('(');
    const publicData = ownershipRows[2]
      .querySelector('td')
      .textContent.split('(');

    return {
      listingDate,
      stockListedShares,
      paidUpCapital,
      marketCapitalization,
      promoterShares: promoterData[0].trim(),
      promoterPercentage: promoterData[1].replace(')', ''),
      publicShares: publicData[0].trim(),
      publicPercentage: publicData[1].replace(')', ''),
    };
  });

  await browser.close();
}
singleSecurityDetail().catch(console.error);
