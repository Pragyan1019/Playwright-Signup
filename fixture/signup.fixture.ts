import {test as base ,Page} from '@playwright/test';
import { Setup } from '../pages/signin';
import { EmailVerification } from '../pages/emailverification';
import { Agency } from '../pages/Agencydetail';
import { Professional } from '../pages/professionalexp';
import { Preference } from '../pages/preferences';

type myFixtures = {
    setup: Setup;
    emailverification: EmailVerification;
    agency:Agency;
    professional:Professional;
    preference:Preference

}

export const mytest = base.extend<myFixtures>({
    setup: async ({ page }, use) => {
        const setup = new Setup(page);
        await page.goto('https://authorized-partner.vercel.app/register');
        await page.getByRole('checkbox', { name: 'I agree to the Terms of' }).click();
        await page.getByRole('button', { name: 'Continue' }).click();
        await use(setup);
    },
    emailverification: async ({ page }, use) => {
        const emailverification = new EmailVerification(page);
        await use(emailverification);
    },
    agency: async({page},use) =>{
        const agency = new Agency(page);
        await use(agency);
    },
    professional: async({page},use) =>{
        const professional = new Professional(page);
        await use(professional);
    },
    preference: async({page},use) =>{
        const preference = new Preference(page);
        await use(preference);
    }

})