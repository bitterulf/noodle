// features/support/steps.js
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
