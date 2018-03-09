# features/noodle.feature
Feature: Simple noodes
  In order to be healthy
  As a developer
  I want to eat noodles

  Scenario: easy eating
    Given i have 10 noodles
    When I eat 5 noodles
    Then there are 5 noodles remaining
