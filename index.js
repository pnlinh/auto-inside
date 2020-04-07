const puppeteer = require('puppeteer');

const url = 'https://inside.fptshop.com.vn/DefaultIntranet.aspx';

const account = {
   username: '',
   password: ''
};

async function start(url) {
    const browser = await puppeteer.launch({headless: false});
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

    console.log(response);

    // Checkin
    try {
        await page.click('#imgcheckin', {delay: 200});
    } catch (err) {
        console.error(err);

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
