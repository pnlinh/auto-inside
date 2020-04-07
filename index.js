const puppeteer = require('puppeteer');
const fs = require('fs');
const dotenv = require('dotenv');
const config = dotenv.config();

const url = process.env.INSIDE_WEB_URL || 'https://inside.fptshop.com.vn';

const account = {
   username: process.env.INSIDE_CODE,
   password: process.env.INSIDE_PASS,
};

async function start(url) {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.setViewport({width: 1366, height: 768});

    await page.goto(url, {
        waitUntil: 'networkidle0'
    });

    await page.type('#ctl00_ContentPlaceHolder1_ctl00_txtUserName', account.username, {delay: 100});
    await page.type('#ctl00_ContentPlaceHolder1_ctl00_txtPassword', account.password, {delay: 100});

    const [response] = await Promise.all([
        page.click('#ctl00_ContentPlaceHolder1_ctl00_btnLogin', {delay: 100}),
        page.waitForNavigation({waitUntil: 'networkidle0'}),
    ]);

    console.log('Login successfully');

    console.log(response);

    // Checkin
    try {
        await page.click('#imgcheckin', {delay: 200});

        console.log('Checkin OK');
        fs.appendFileSync('logs.txt', `Checkin OK at: ${new Date} \r`);
    } catch (err) {
        //console.error(err);
        console.log('Checkin error');
        fs.appendFileSync('logs.txt', `Checkin error at: ${new Date} \r`);

        await closeBrowser(browser.close(), 5000);
    }

    // Log out
    //await page.click('#ctl00_LinkButton1', {delay: 200});

    await closeBrowser(browser.close());
}

function closeBrowser(callback, timer = 1000) {
    return new Promise(resolve => {
        setTimeout(() => {
            return resolve(callback);
        }, timer);
    });
}

try {
    start(url);
} catch (e) {
    console.error(e.message);
}
