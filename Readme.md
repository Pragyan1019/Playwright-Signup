# Signup Automation (Playwright)

Automated registration flow https://authorized-partner.vercel.app/register

Includes the 4 steps: Personal Details, Agency Details, Professional Experience, Verification and Preferences. Includes one full valid flow (`valid_001`) and sample invalid cases .


## Files

- `signup_automation_script.spec.ts` : test file
- `README_execution_steps.md` 
- `test_report.pdf` : test run report
- `demo_video.mp4` : Demo video
- `pages/` : page objects
- `fixture/signup.fixture.ts` : opens the register page and accepts the terms
- `testdata/Inputform.pdf` : Dummy pdf to upload
- `utils/emailotp.ts` : gets the email OTP from mail.tm
- `utils/signinfirst.data.json` : test data (valid and invalid cases)

## Prerequisites

- Node.js 
- npm


## Environment

- Language: TypeScript
- Framework: Playwright Test 
- Playwright installs its own browsers
- Browsers: Chromium, Firefox, WebKit
- OS used: Windows 11

## How to run

Install:

```bash
npm install
npx playwright install --with-deps
```

Run all tests:

```bash
npx playwright test signup_automation_script.spec.ts --project=chromium --headed
```

Open the HTML report:

```bash
npx playwright show-report
```

## Test data and accounts

- No real accounts are used.
- Names, password, agency details: `utils/signinfirst.data.json`.

## Notes

- The OTP step waits for the email, so a full run takes a bit longer.
- Only sample invalid cases are automated.