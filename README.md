# Playwright API Testing

This repo holds the code for practicing API Test Automation.

## Test Execution

```shell

# Install Playwright
npm init playwright@latest

# Run all tests
npx playwright test

# Run test and show report
npx playwright test show-report

# Run failed test only
npx playwright test --last-failed

# Run test with matching title
npx playwright test -g 'Get Tags'

# Run specific test file
npx playwright test practice.spec.ts

# Run test project (configured in playwright.config.ts)
npx playwright test --project conduit-bondaracademy

```