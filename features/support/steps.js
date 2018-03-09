// features/support/steps.js

var webdriver = require('selenium-webdriver');

const { Given, When, Then } = require('cucumber')
const { expect } = require('chai')

Given('a variable set to {int}', function(number) {
  this.setTo(number)
})

When('I increment the variable by {int}', function(number) {
  this.incrementBy(number)
})

Then('the variable should contain {int}', function(number) {
  expect(this.variable).to.eql(number)
})

Given('i have {int} noodles', function (int, callback) {
    this.setNoodles(int);
    callback(null);
});

When('I eat {int} noodles', function (int, callback) {
    this.eatNoodles(int);
    callback(null);
});

Then('there are {int} noodles remaining', function (int) {
    expect(this.getNoodles()).to.eql(int)
});

Given(/^I open the (.*) browser$/, function (browser) {
    this.setupDriver(browser);
});

Given(/^I surf to (.*)$/, function (url, callback) {
    this.driver.get(url).then(function(){
        callback();
    });
});

When(/^I enter (.*) into the searchbox$/, function (string, callback) {
    this.driver.findElement(webdriver.By.id('searchInput')).sendKeys(string+'\ue006').then(function(){
        setTimeout(callback, 1000);
    });
});

Then(/^I see (.*) in the webpage title$/, function (string, callback) {
    this.driver.getTitle().then((title) => {
        this.driver.quit();
        try {
            expect(title).to.eql(string + ' – Wikipedia')
            callback();
        } catch(e) {
            callback(e);
        }
    });
});
