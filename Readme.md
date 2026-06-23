# Playwright Test Automation – Agent Registration Flow

## Why Playwright?

I am currently learning test automation and have hands-on experience with **Playwright**. While I am aware of Selenium as an industry-standard tool, I am not yet confident with its exact syntax for locators and assertions. Since Playwright offers a more intuitive API, built-in auto-waiting, and modern locator strategies out of the box, I chose to use Playwright for this project to ensure reliable and readable test coverage.

---

## Project Overview

This project automates the **Agent Registration Flow** for a multi-step sign-up form that includes:

- **Step 1 – Personal Details** (First Name, Last Name, Email, Phone, Password)
- **Step 2 – Agency Details** (Agency Name, Role, Email, Website, Address, Region of Operation)
- **Step 3 – Professional Experience** (Years of Experience, Students Recruited, Focus Area, Success Metrics, Services)
- **Step 4 – Verification and Preferences** (Business Registration Number, Preferred Countries, Institution Type, Certifications, Documents)

---

## What Has Been Automated

### ✅ Valid Cases
- A complete end-to-end valid registration flow (`valid_001`) covering all four steps with realistic test data.

### ✅ Invalid Cases – Personal Details (Sample Coverage)
Sample invalid cases have been automated for **Step 1 – Personal Details**, including:

| Category | Cases Covered |
|---|---|
| First Name | Empty, single character |
| Last Name | Empty, single character |
| Email | Missing `@`, missing domain, missing TLD, spaces in email |
| Password | Too short, missing number, missing special character, empty |
| Confirm Password | Mismatch, empty while password is filled |
| Multiple Errors | Combinations of the above |
| Duplicate Data | Already registered phone number |

> **Note:** These are **sample** invalid cases to demonstrate validation coverage. Not every edge case has been covered at this stage.

---

## Email OTP Verification

The registration flow includes an **email OTP verification step** after personal details are submitted. For testing this, the project uses **GuerrillaMail** — a temporary email service — via its API to:

1. Create a unique temporary inbox per test run
2. Poll the inbox for the OTP email (up to 10 attempts, 3 seconds apart)
3. Extract the 6-digit OTP using a regex pattern
4. Enter the OTP into the verification field and proceed

> **Learning Note:** Email OTP testing is a relatively advanced topic in test automation. I am currently **learning it in detail** — understanding how temporary mail APIs work, how to handle polling with retries, and how to handle timing issues between email delivery and test execution. The current implementation works but may be further refined as my understanding deepens.

---

## Project Structure

```
├── pages/
│   ├── Agencydetail.ts       # Page Object for Agency Details step
│   ├── preferences.ts        # Page Object for Preferences step
│   └── Professional.ts       # Page Object for Professional Experience step
├── tests/
│   └── example.spec.ts       # Main test file
├── testdata/
│   ├── testdata.json         # Valid and invalid test cases
│   └── hell.pdf              # Sample document for upload field
├── playwright.config.ts
└── package.json
```

---

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- npm

---

## Installation

```bash
# Install project dependencies
npm install

# Install Playwright browsers (Chromium only)
npx playwright install chromium --with-deps
```

---

## Running Tests

### Run the main test file
```bash
npx playwright test example.spec.ts
```

### Run with headed browser (visible browser window)
```bash
npx playwright test example.spec.ts --headed
```

### Run a specific test by name
```bash
npx playwright test example.spec.ts -g "valid_001"
```

### Run and view the HTML report
```bash
npx playwright test example.spec.ts
npx playwright show-report
```

---

## Configuration

Key settings in `playwright.config.ts`:

```ts
export default defineConfig({
  timeout: 90000,        // 90s per test to account for OTP polling delays
  retries: process.env.CI ? 1 : 0,
  use: {
    headless: true,
    video: 'retain-on-failure',
  },
});
```

> The timeout is set to **90 seconds** because OTP email delivery can take up to 6 polling attempts × 3 seconds each, on top of the multi-step form interactions.

---

## Known Limitations

- Only **sample** invalid cases are covered for personal details; agency, professional, and preference invalid cases are partially defined in test data but not all are fully automated yet.
- Email OTP flow depends on GuerrillaMail API availability and email delivery speed, which can cause occasional flakiness.
- The project currently uses `workflow_dispatch` only for CI — automatic triggers on `push`/`pull_request` are not yet configured.

---

## Future Improvements

- Add full invalid case coverage for Agency, Professional, and Preference steps
- Deepen OTP handling with better retry logic and timeout management
- Add Selenium version of the same tests once Selenium syntax is more familiar
- Set up proper CI/CD pipeline with browser caching to reduce run times