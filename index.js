const express = require('express');
const app = express();
const cron = require('node-cron');
const puppeteer = require('puppeteer');

/** 
 * * NEEDS TO RUN 2 days in advance so if you want a monday slot you book saturday, if you want tuesday you book sunday
 * * '3 0 13 * * Sat,Mon,Wed'
 * 
 * * https://www.npmjs.com/package/node-cron
 */
cron.schedule('0 0 13 * * Sat,Mon,Wed', () =>{
    (async () => {

        /**
         * * Gets the current day of the week and will then handle error check for booking 2 days in advance
         */
        let today = await new Date().getDay();
        const toBookDay = (today + 2) >= 7 ? (today + 2) - 7: today + 2;
        
        /**
         * * Inorder to book 2 days in advance and ensure when you are booking for monday
         */

        const browser = await puppeteer.launch({
            /* headless:false */
        });
        /**
         * * Required for accepting the confirm message
         */
        const page = await browser.newPage();

        await page.goto('https://onehealthclubs.antaris.ca/v2/', {waitUntil:'networkidle2'});
        /**
         * * Email that you registered your account with at the gym
         */
        await page.type('div.row:nth-child(1) > div:nth-child(1) > input:nth-child(2)', '*******@gmail.com');
        /**
         * * Password that you were given at the gym. typically 6 number pin unless changed
         */
        await page.type('div.row:nth-child(2) > div:nth-child(1) > input:nth-child(2)', '******');

        await page.click('.button');

        page.on('dialog', async dialog => {
            console.log(dialog.message());
            await dialog.accept()
        });
        /**
         * * Go to the Booking Page and wait for it to load
         */
        await page.goto('https://onehealthclubs.antaris.ca/v2/client/classes_public/index.php?loc_id=4', {waitUntil:'networkidle2'});
        /**
         * * Since you can book two days in advance and the weeks booking runs from SAT-SUN,
         * * you will need to move to the next weeks page when booking for a class that is ran on Sunday or Monday.
         */
        if (today >= 5){
            /**
             * * Click the arror to 'Right Carat' to move to the next weeks bookings
             */
            await page.$eval('div.text-center.upper.date-options' , el => el.lastElementChild.click())
            
        }

        /**
         * * Might break for monday bookings since it will not appear at the top of the page ... 
         * * will need to hard code the xpath for that case. 
         * 
         * * It will also execture twice once to reload so the login is processed then it is registered
         * * The 1 second delay is needed to process the click to sign in, then the second click is to book
         */
        const registerBooking = await page.$x('/html/body/div/section/form/div/div[3]/div[10]/div[4]');
        await registerBooking[0].click(); 
        await page.waitForNavigation({waitUntil:"networkidle2"});

        const signInBooking = await page.$x('/html/body/div/section/form/div/div[3]/div[10]/div[4]');
        await signInBooking[0].click(); 
        await page.waitForNavigation({waitUntil:"networkidle2"});

        await browser.close();
      })();
})
