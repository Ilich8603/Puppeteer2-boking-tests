const puppeteer = require("puppeteer");
const chai = require("chai");
const expect = chai.expect;
const {
     Given,
     When,
     Then,
     Before,
     After,
     setDefaultTimeout
} = require("cucumber");

const { clickElement, getText } = require("../../lib/commands.js");

setDefaultTimeout(70000);

Before(async function () {
    const browser = await puppeteer.launch({ 
        headless: false,
        slowMo: 100 });
    const page = await browser.newPage();
  
    this.browser = browser;
    this.page = page;
    await this.page.goto('http://qamid.tmweb.ru/client/index.php', {
        setTimeout: 20000,
    });    
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});

Given("user is on main page", async function () {
    
});


When("user selects the day number {int} in navigation menu", async function (dayIndex) {
    return await clickElement(this.page, `.page-nav__day:nth-child(${dayIndex})`);
});

When('user selects session ID {string}', async function (seanceId) {
    return await clickElement(this.page, `.movie-seances__time[data-seance-id="${seanceId}"]`);
});

Then('user sees the hall scheme', async function () {
    return await this.page.waitForSelector('.buying-scheme', { timeout: 10000 });
});

When('user selects {string}', async function (chair) {
    return await clickElement(this.page, `.buying-scheme__${chair}`);
});

When('user selects 3 VIP places', async function () {
    await clickElement(this.page, '.buying-scheme__row:nth-child(10) .buying-scheme__chair_vip:nth-child(2)');
    await clickElement(this.page, '.buying-scheme__row:nth-child(10) .buying-scheme__chair_vip:nth-child(3)');
    await clickElement(this.page, '.buying-scheme__row:nth-child(10) .buying-scheme__chair_vip:nth-child(4)');
});

When('user push the button {string}', async function (buttonText) {
    return await clickElement(this.page, '.acceptin-button');
});

Then('the button {string} disabled', async function (string) {
    const button = await this.page.$('.acceptin-button');
    const isDisabled = await button.evaluate((btn) => btn.disabled);
    expect(isDisabled).equal(true);
}, 20000);


Then('user sees title of the movie {string}', async function (expectedTitle) {
    const title = await getText(this.page, '.ticket__details.ticket__title');
    expect(title).to.include(expectedTitle);
});


Then('numbers of booking tickets {int}', async function (expectedCount) {
  const chairsText = await getText(this.page, '.ticket__details.ticket__chairs'); 
  const count = chairsText.split(',').length;
  expect(count).to.equal(expectedCount);
});
