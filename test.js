var webdriver = require('selenium-webdriver');
require('dotenv').config();

var capabilities = {
 'browserName' : 'Chrome',
 'browser_version' : '62.0',
 'os' : 'Windows',
 'os_version' : '10',
 'resolution' : '1024x768',
 'browserstack.user' : process.env.BROWSERSTACK_USER,
 'browserstack.key' : process.env.BROWSERSTACK_KEY
}

var driver = new webdriver.Builder().
  usingServer('http://hub-cloud.browserstack.com/wd/hub').
  withCapabilities(capabilities).
  build();

driver.get('https://de.wikipedia.org/wiki/Wikipedia:Hauptseite').then(function(){
  driver.findElement(webdriver.By.id('searchInput')).sendKeys('Foo\n').then(function(){
    driver.getTitle().then(function(title) {
      console.log(title);
      driver.quit();
    });
  });
});
