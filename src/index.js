const puppeteer = require('puppeteer');
const {
    v1: uuidv1,
    v4: uuidv4,
} = require('uuid');
const fs = require('fs')
var count = 1;
const url = "https://social-sg.xyz/700388236171";
var arrayProfiles = [];
var listEmails = [];
const readEmail = file => new Promise((resolve, reject) => {
    fs.readFile(file, (err, contents) => {
        if (err) {
            reject(err);
        } else {
            resolve(contents)
        }
    })
});

// const emails = async () => {
//     let arrayEmails = [];
//     const email = await readEmail("src/emails/emails.txt");
//     arrayEmails = (String(email).split(","));
//     return arrayEmails;
// }

const robot = async (profile, browser) => {
    if (profile !== undefined && count<100) {
        // const browser = await puppeteer.launch({
        //     headless: false
        // }
        // );
        const siteRegister = "https://social-sf.xyz/register.php";
        const siteDashboard = "https://social-eh.xyz/dashboard.php";
        const page = await browser.newPage();
        await page.setViewport({
            width: 900,
            height: 900
        })
        await page.goto(url);
        await page.evaluate(async () => {
            await document.querySelector('a[class="btn btn-white d-none d-md-block"]').click();
        })

        //Register
        await page.goto(siteRegister);
        await page.waitForTimeout(8000);
        await page.type('input[name="fullname"]', profile.fullname, { delay: 400 });
        await page.type('input[name="username"]', profile.username, { delay: 400 });
        await page.type('input[name="email"]', profile.email, { delay: 400 });
        await page.type('input[name="password"]', profile.password, { delay: 400 });
        await page.type('input[name="passwordAgain"]', profile.password, { delay: 400 });
        await page.evaluate(() => {
            document.querySelector('input[name="terms"]').click();
            document.querySelector('button[type="button"]').click();
        })

        try {
            await page.waitForTimeout(6000);
            await page.click('button[class="close"]');
            await page.waitForTimeout(6000);
            await page.screenshot({ path: `${profile.username}.png`, fullPage: true });
        } catch (e) {
            console.log(e);
        } finally {
            browser.close();
            count++;
            console.log(count);
            bridgeProfile();
        }
    } else {
        console.log("Até o robo tem que descansar meu bom");
    }

};

const generateProfile = async ()=>{
    const browser = await puppeteer.launch({
        headless: false
    }
    );
    const page = await browser.newPage();
    await page.setViewport({
        width: 900,
        height: 900
    })
    await page.goto("https://theonegenerator.com/pt/geradores/documentos/gerador-de-email/");
    await page.waitForTimeout(5000);

    await page.click('#app-content > section > div.container > div > div.col > div.generator-container > div > div > div > div.generator > form > button');

     return {
         profile: await page.evaluate(async () => {
        const email = document.querySelector("#copyToClipboard-email").value;
        console.log(email);
        if (email.split("@")[0].length > 5) {
            const profile = {
                fullname: email.split("@")[0],
                username: email.split("@")[0],
                email: email,
                // password: uuidv4().split('-').pop()
                password: `teste${Math.random(4)*10}`
            }
            return profile;
        } 
    }),
    browser: browser
}
};
const bridgeProfile = async()=>{
    const {profile, browser} = await generateProfile()
     robot(profile, browser);
};
bridgeProfile();
    // (async () => {
    //     listEmails = await emails();
    //     listEmails.map(item => {
    //         if (item.split("@")[0].length > 5) {
    //             arrayProfiles.push(
    //                 {
    //                     fullname: item.split("@")[0],
    //                     username: item.split("@")[0],
    //                     email: item,
    //                     password: uuidv4().split('-').pop()
    //                 }
    //             );
    //         }
    //     });
    //     await robot(arrayProfiles[count]);
    // })();