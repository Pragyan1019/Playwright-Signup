import {Page,Locator} from '@playwright/test';

export class EmailVerification{
    page:Page
    verificationform: Locator;
    textbox :Locator;
    submitmailcode: Locator;
    resendcode:Locator;

    constructor(page:Page){
        this.page = page;
        this.verificationform = page.locator('.lg\\:max-w-\\[550px\\]')
        this.textbox = page.getByRole('textbox');
        this.submitmailcode = page.getByRole('button', { name: 'Verify Code' })
        this.resendcode = page.getByText('Resend Code')
    }
    async fillTextbox(num: string){
        await this.textbox.fill(num);
    }
    async submitcod(){
        await this.submitmailcode.click();
    }
    async resend(){
        await this.resendcode.click();
    }
}