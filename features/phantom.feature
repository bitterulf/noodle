# features/wikiSearch.feature
@Only
Feature: Phantom Example
  In whatever
  As whatever
  I want to whatever

  Scenario: searching for content
    Given I open phantomJS
    Given I surf with phantomJS to https://developer.mozilla.org/en-US/
    Then I see MDN Web Docs in the webpage title in phantomJS
