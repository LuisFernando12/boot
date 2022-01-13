const puppeteer = require('puppeteer');
var count = 0;
const url = "https://social-aj.xyz/841012954594";
const siteRegister = "https://social-aj.xyz/register.php";
const siteDashboard = "https://social-aj.xyz/dashboard.php";


const robot = async (profile, browser) => {
    if (profile !== undefined && count < 100) {
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
            await page.screenshot({ path: `src/img/${profile.username}.png`, fullPage: true });
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

const generateProfile = async () => {
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
            if (email.split("@")[0].length > 5) {
                const profile = {
                    fullname: email.split("@")[0],
                    username: email.split("@")[0],
                    email: email,
                    // password: uuidv4().split('-').pop()
                    password: `teste${Math.random(4) * 10}`
                }
                return profile;
            }
        }),
        browser: browser
    }
};
const bridgeProfile = async () => {
    const { profile, browser } = await generateProfile();
    robot(profile, browser);
};
bridgeProfile();
    