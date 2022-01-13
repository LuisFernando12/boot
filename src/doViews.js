const puppeteer = require('puppeteer');
const url = "https://social-aj.xyz/841012954594";
var count = 0;
const robotView =  async () =>{
    const browser = await puppeteer.launch({
        headless: true
    }
    );
    const page = await browser.newPage();
    await page.setViewport({
        width: 900,
        height: 900
    })
    await page.goto(url);
    await page.waitForTimeout(10000);
    // await page.screenshot({ path: `src/img/onlyViews/view${count}.png`, fullPage: true });

    await browser.close();
    console.log(count);
    count++;
    robotView();

};
robotView();


