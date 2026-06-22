import {Page,Locator} from '@playwright/test';
export class Preference{
    page:Page;
    crf:Locator
    brn:Locator
    pc:Locator
    nep:Locator
    pin:Locator
    cd:Locator
    ubd:Locator
    nextclick:Locator
    errbrn:Locator
    errpc:Locator
    errpin:Locator
    errubd:Locator
    constructor(page:Page){
        this.page=page;
        this.crf = page.getByText('Complete Your Agent Profile in Steps1. Set up your Account2. Agency Details3.');
        this.brn = page.getByRole('textbox', { name: 'Business Registration Number' });
        this.pc = page.getByRole('combobox', { name: 'Preferred Countries' })
        this.nep =page.locator('div').filter({ hasText: /^Nepal$/ }) 
        this.pin = page.getByRole('checkbox', { name: 'Universities' })
        this.cd = page.getByRole('textbox', { name: 'Certification Details (' })
        this.ubd = page.locator('.flex.flex-col.items-center').first()
        this.nextclick = page.getByRole('button', { name: 'Submit' })
        this.errbrn = page.getByText('Please enter your')
        this.errpc = page.getByText('You have to select at least one country.')
        this.errpin = page.getByText('You have to select at least one institution type.')
        this.errubd = page.getByText('At least one document must be')
    }

    async fill(br:string,cd:string){
         await this.brn.waitFor({ state: 'visible' });

        await this.brn.click();
        await this.brn.fill(br);
        await this.pc.click();
        await this.nep.click();
        await this.pin.click();
        await this.cd.click();
        await this.cd.fill(cd);
        await this.ubd.setInputFiles('D:/Projects/Vrit tech initiall/hell.pdf')
        
    }
    async submit(){
        await this.nextclick.click();
    }

}