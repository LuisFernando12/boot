'use-strict'
const puppeteer = require('puppeteer');
const fs = require('fs')
const {
    v1: uuidv1,
    v4: uuidv4,
} = require('uuid');
var arrayProfiles = [];
var listEmails = [];
var count = 0;
const url = "https://social-aj.xyz/841012954594";
const siteRegister = "https://social-aj.xyz/register.php";
const siteDashboard = "https://social-aj.xyz/dashboard.php";
const readEmail = file => new Promise((resolve, reject) => {
    fs.readFile(file, (err, contents) => {
        if (err) {
            reject(err);
        } else {
            resolve(contents)
        }
    })
});

const emails = async () => {
    let arrayEmails = [];
    const email = await readEmail("src/emails/emails.txt");
    arrayEmails = (String(email).split(","));
    return arrayEmails;
}
const robot = async (profile) => {
    if (profile !== undefined && count < 100) {
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
        await page.evaluate(async () => {
            await document.querySelector('a[class="btn btn-white d-none d-md-block"]').click();
        })

        //Register
        await page.goto(siteRegister);
        await page.waitForTimeout(8000);

        await page.waitForSelector('input[name="fullname"]' , {
            timeout: 1000
        });
        await page.type('input[name="fullname"]', profile.fullname, { delay: 400 });
       
        await page.waitForSelector('input[name="username"]' , {
            timeout: 1000
        });
        await page.type('input[name="username"]', profile.username, { delay: 400 });

        await page.waitForSelector('input[name="email"]' , {
            timeout: 1000
        });
        await page.type('input[name="email"]', profile.email, { delay: 400 });

        await page.waitForSelector('input[name="password"]' , {
            timeout: 1000
        });
        await page.type('input[name="password"]', profile.password, { delay: 400 });

        await page.waitForSelector('input[name="passwordAgain"]' , {
            timeout: 1000
        });
        await page.type('input[name="passwordAgain"]', profile.password, { delay: 400 });
        await page.evaluate(() => {
            document.querySelector('input[name="terms"]').click();
            document.querySelector('button[type="button"]').click();
        })

        try {
            await page.waitForTimeout(6000);
            await page.click('button[class="close"]');
            await page.evaluate(() => {
                window.scrollBy(0, window.innerHeight);
            });
            await page.waitForTimeout(10000);
            await page.screenshot({ path: `src/img/emails-txt/${profile.username}.png`, fullPage: true });
        } catch (e) {
            console.log(e);
        } finally {
            browser.close();
            count++;
            console.log(count);
            robot(arrayProfiles[count])
        }
    } else {
        console.log("Até o robo tem que descansar meu bom");
    }

};
(async () => {
        listEmails = await emails();
        listEmails.map(item => {
            if (item.split("@")[0].length > 5) {
                arrayProfiles.push(
                    {
                        fullname: item.split("@")[0],
                        username: item.split("@")[0],
                        email: item,
                        password: uuidv4().split('-').pop()
                    }
                );
            }
        });
        robot(arrayProfiles[count]);
})();
