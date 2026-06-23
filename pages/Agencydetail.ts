import {Page,Locator} from '@playwright/test';

export class Agency{
    page:Page;
    agencyform: Locator;
    agencyname: Locator;
    agencyrole: Locator;
    agencymail: Locator;
    agencywebsite: Locator;
    agencyaddress: Locator;
    agencyROO: Locator;
    srhbox:Locator;
    nep:Locator;
    nextbtn :Locator;
    erroraname:Locator
    errorarole:Locator
    erroramail:Locator
    errorawebsite:Locator
    erroraaddress:Locator
    erroraroo:Locator


    constructor(page:Page){
        this.page = page;
        this.agencyform= page.getByText('Complete Your Agent Profile in Steps1. Set up your Account2. Agency Details3.');
        this.agencyname = page.getByRole('textbox', { name: 'Name' });
        this.agencyrole = page.getByRole('textbox', { name: 'Role in Agency' })
        this.agencymail = page.getByRole('textbox', { name: 'Email Address' })
        this.agencywebsite = page.getByRole('textbox', { name: 'Website' })
        this.agencyaddress = page.getByRole('textbox', { name: 'Address', exact: true })
        this.agencyROO = page.getByRole('combobox')

        this.srhbox = page.getByRole('textbox', { name: 'Search...' })
        this.nep = page.locator('div').filter({ hasText: 'Nepal' }).nth(5)
        this.nextbtn = page.getByRole('button', { name: 'Next' })


        this.erroraname = page.getByText('Go to LoginComplete Your')
        this.errorarole = page.getByText('Please enter your role')
        this.erroramail = page.getByText('Invalid email address')
        this.errorawebsite = page.getByText('Please enter your website')
        this.erroraaddress = page.getByText('Please enter your address')
        this.erroraroo = page.getByText('You have to select at least')
    }

    async fillagencyform(name:string,role:string,mail:string,website:string,address:string) {
        await this.agencyname.fill(name);
        await this.agencyrole.fill(role);
        await this.agencymail.fill(mail);
        await this.agencywebsite.fill(website);
        await this.agencyaddress.fill(address);
        await this.agencyROO.click();    
        await this.srhbox.fill('Nepal')
        await this.nep.click();    
    }
    async clicknext(){
        await this.nextbtn.click();


    }

}