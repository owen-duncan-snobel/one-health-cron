# One-Health-Cron
Automatic gym bookings with puppeteer and node-cron inorder to get your desired gym time slot every week. 


## Installation
First ensure that you have [node.js](https://nodejs.org/en/ "node.js") installed. Type
```
node -v
``` 
to check and see if it is installed.

Next clone this repository and place in a local folder or on a server where you want the to be ran. 

 Functionality for it to be hosted on a server will be added soon. For deployment to heroku or  anywhere cron tasks can be hosted.
 
 cd from the command line / terminal to the folder where to index.js and package.json are held and run   
 ```
npm install
```
to install all the required modules. Lastly run 
```
node index.js 
```
to start the cron task.

## Documentation 
To update for your specific 3 days of booking it requires you book 2 days in advance.

ex) Book for Monday, Wednesday, Friday @ 1pm looks as follows.

```javascript
cron.schedule('0 0 13 * * Sat,Mon,Wed', () =>{}
```

Refer to [node-cron](https://www.npmjs.com/package/node-cron "node-cron") for find a specific time or when to be ran. 

Ensure you update the file to hold your email and pin. Or set up env variables if needed ([dotenv](https://www.npmjs.com/package/dotenv "dotenv"))

On Line 37 and 41
```javascript
 await page.type('div.row:nth-child(1) > div:nth-child(1) > input:nth-child(2)', '*******@gmail.com');
 ...
 await page.type('div.row:nth-child(2) > div:nth-child(1) > input:nth-child(2)', '******');
```



