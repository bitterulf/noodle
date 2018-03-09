// features/support/world.js

var {setDefaultTimeout} = require('cucumber');

// setDefaultTimeout(60 * 1000);

var webdriver = require('selenium-webdriver');
require('dotenv').config();

const { setWorldConstructor } = require('cucumber')

class CustomWorld {
  constructor() {
    this.variable = 0
    this.noodles = 0
    this.driver
  }

  setTo(number) {
    this.variable = number
  }

  incrementBy(number) {
    this.variable += number
  }

  setNoodles(number) {
    this.noodles = number
  }

  eatNoodles(number) {
    this.noodles -= number
  }

  getNoodles() {
    return this.noodles;
  }

  setupDriver(browser) {
      var capabilities = {
        'browserName' : browser,
        'os' : 'Windows',
        'os_version' : '10',
        'resolution' : '1024x768',
        'browserstack.user' : process.env.BROWSERSTACK_USER,
        'browserstack.key' : process.env.BROWSERSTACK_KEY
    };

      this.driver = new webdriver.Builder().
      usingServer('http://hub-cloud.browserstack.com/wd/hub').
      withCapabilities(capabilities).
      build();
  }
}

setWorldConstructor(CustomWorld)
