import { expect,Locator } from '@playwright/test';
import { Setup} from '../pages/signin';
import { EmailVerification } from '../pages/emailverification';
import { mytest as test } from '../fixture/signup.fixture';

import { generateInbox, createGuerrillaSession, getOTPFromGuerrillaMail } 
 from '../utils/emailotp';

import userdata from '../utils/signinfirst.data.json';
test.describe('Sign In Page', () => {
    // let setup: Setup;
    // let emailverification: EmailVerification;
    // test.beforeEach(async ({ page }) => {
    //     setup = new Setup(page);
    //     emailverification = new EmailVerification(page);
    //     await page.goto('https://authorized-partner.vercel.app/register');
    //     await page.getByRole('checkbox', { name: 'I agree to the Terms of' }).click();
    //     await page.getByRole('button', { name: 'Continue' }).click();
    // })
    // test('visible elements', async ({ setup }) => {
    //     await expect(setup.firstname).toBeVisible();
    // })
    // test('fill form and navigate to next page', async ({ setup }) => {
    //     await setup.fillForm('John', 'Doe', 'johndoe456@gmail.com','9876543210', 'Password@123', 'Password@123');
        
    //     await expect(setup.nextButton).toBeEnabled();
    //     await setup.clickNext();

    // })
    userdata.validCases.forEach(({id,description,data})=>{
        test(` ${id} : ${description}`, async ({ setup,emailverification,agency,preference,professional, request }) => {
                const inbox = generateInbox();
  const { email, sidToken } = await createGuerrillaSession(request, inbox);
  console.log('Using email:', email);            await setup.fillForm(data.firstName, data.lastName, email, data.phone, data.password, data.confirmPassword);
            await setup.clickNext();
            await expect(emailverification.verificationform).toBeVisible();
  const otp = await getOTPFromGuerrillaMail(request, sidToken);
            await expect(emailverification.verificationform).toBeVisible();
            await emailverification.fillTextbox(otp);
            await emailverification.submitcod();
            await agency.fillagencyform(data.agencyName,data.agencyRole,data.agencyEmail,data.agencyWebsite,data.agencyAddress)
            await agency.clicknext();
            await expect(professional.prf).toBeVisible();
            await professional.fill(data.numberOfStudentsRecruited,data.focusArea,data.successMetrics)
            await professional.nextclick();
            await expect(professional.page).toHaveURL('https://authorized-partner.vercel.app/register?step=verification')
            await expect(preference.crf).toBeVisible();
            await preference.fill(data.businessRegistrationNumber,data.certificationDetail)
            await preference.submit();
        })
    })
    // userdata.invalidCases.forEach(({id,description,data,expected})=>{
    //     test(` ${id} : ${description}`, async ({ setup }) => {
    //         await setup.fillForm(data.firstName, data.lastName, data.email, data.phone, data.password, data.confirmPassword);
    //         await setup.clickNext();
    //         if (expected && expected.errors && expected.errors.length && !id.startsWith("invalid_em")) {
    //             for (const error of expected.errors) {
    //                 const locator = setup[error.locator as keyof typeof setup] as Locator;
    //                 await expect.soft(locator).toBeVisible();
    //             }
    //         }
    //         await expect(setup.page).toHaveURL('https://authorized-partner.vercel.app/register?step=setup')
            
    //     })

    // })

})