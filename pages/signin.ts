import { Page, Locator } from '@playwright/test'


export class Setup {
    page: Page;
    firstname: Locator;
    lastname: Locator;
    email: Locator;
    phone: Locator;
    password: Locator
    confirmPassword: Locator;
    nextButton: Locator;

    errorfirstname: Locator;
    errorlastname: Locator
    erroremail: Locator;
    errorpassword8chars: Locator
    errorpasswordnum: Locator;
    errorpasswordspecialchar: Locator
    mismatchconfirmPassword: Locator;
    phonealreadyexits: Locator

    constructor(page: Page) {
        this.page = page;
        this.firstname = page.getByRole('textbox', { name: 'First Name' });
        this.lastname = page.getByRole('textbox', { name: 'Last Name' });
        this.email = page.getByRole('textbox', { name: 'Email' });
        this.phone = page.getByRole('textbox', { name: 'Phone Number' });
        this.password = page.locator('input[name="password"]');
        this.confirmPassword = page.locator('input[name="confirmPassword"]');
        this.nextButton = page.getByRole('button', { name: 'Next' });

        this.errorfirstname = page.getByText('First name must be at least 2');
        this.errorlastname = page.getByText('Last name must be at least 2');
        this.erroremail = page.getByText('Invalid email address');
        this.errorpassword8chars = page.getByText('Password must be at least 8').first();
        this.errorpasswordnum = page.getByText('Password must contain at').first()
        this.errorpasswordspecialchar = page.getByText('Password must contain at').first();
        this.mismatchconfirmPassword = page.getByText('Passwords do not match');
        this.phonealreadyexits = page.getByText('User with this mobile number')


    }
    async goto(){
        await this.page.goto('https://authorized-partner.vercel.app/register');
        await this.page.getByRole('checkbox', { name: 'I agree to the Terms of' }).click();
        await this.page.getByRole('button', { name: 'Continue' }).click();

    }
    async fillForm(firstname: string, lastname: string, email: string, phone: string, password: string, confirmPassword: string) {
        await this.firstname.fill(firstname);
        await this.lastname.fill(lastname);
        await this.email.fill(email);
        await this.phone.fill(phone);
        await this.password.fill(password);
        await this.confirmPassword.fill(confirmPassword);
    }
    async clickNext() { 
        await this.nextButton.click();
    }

}
