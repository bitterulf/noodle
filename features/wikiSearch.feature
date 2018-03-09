# features/wikiSearch.feature
Feature: Simple Wikipedia Search
  In order to increase my knowledge
  As a internet user
  I want to read about things on wikipedia

  Scenario: searching for content
    Given I open the Chrome browser
    Given I surf to https://de.wikipedia.org/wiki/Wikipedia:Hauptseite
    When I enter Foo into the searchbox
    Then I see Foo in the webpage title

  Scenario: searching for other content
    Given I open the Chrome browser
    Given I surf to https://de.wikipedia.org/wiki/Wikipedia:Hauptseite
    When I enter Javascript into the searchbox
    Then I see JavaScript in the webpage title

  Scenario: searching for other content
    Given I open the Firefox browser
    Given I surf to https://de.wikipedia.org/wiki/Wikipedia:Hauptseite
    When I enter Javascript into the searchbox
    Then I see JavaScript in the webpage title
