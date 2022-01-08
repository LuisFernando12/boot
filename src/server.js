'use-strict'
const puppeteer = require('puppeteer');
var email ="";
(async()=>{
    const browser = await puppeteer.launch({
        headless: false
    }
    );
    // const siteRegister = "https://social-sf.xyz/register.php";
    const page = await browser.newPage();
    await page.setViewport({
        width: 900,
        height: 900
    })
    await page.goto("https://theonegenerator.com/pt/geradores/documentos/gerador-de-email/");
    await page.waitForTimeout(5000);

    await page.click('#app-content > section > div.container > div > div.col > div.generator-container > div > div > div > div.generator > form > button');

    await page.evaluate(() => {
        email = document.querySelector("#copyToClipboard-email").value;
        console.log(email);
    });
})()