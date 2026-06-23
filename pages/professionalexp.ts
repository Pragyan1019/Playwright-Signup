import {Page,Locator} from '@playwright/test';

export class Professional{
    page:Page;
    yearsofexp:Locator
    yrs4:Locator;
    numofstudreq:Locator
    focusarea:Locator
    successmetricse:Locator
    sericeprovidedcareercounseling:Locator
    nextbtn:Locator
    errorpyop:Locator
    erroranos:Locator
    errorafocus:Locator
    errorasuccess:Locator
    errorservice:Locator

    prf:Locator;
    constructor(page:Page){
        this.page = page;
        this.prf = this.page.getByText('Complete Your Agent Profile in Steps1. Set up your Account2. Agency Details3.')
        this.yearsofexp = page.getByRole('combobox', { name: 'Years of Experience' })
        this.yrs4 = page.getByRole('option', { name: '4 years' }); 
        this.numofstudreq = page.getByRole('spinbutton', { name: 'Number of Students Recruited' })
        this.focusarea = page.getByRole('textbox', { name: 'Focus Area' })
        this.successmetricse = page.getByRole('spinbutton', { name: 'Success Metrics' })
        this.sericeprovidedcareercounseling = page.getByRole('checkbox', { name: 'Career Counseling' })
        this.nextbtn  = page.getByRole('button', { name: 'Next' });

        this.errorpyop = page.getByText('Please select your experience')
        this.erroranos = page.locator('[id="_r_87_-form-item-message"]');
        this.errorafocus =   page.getByText('Please enter your focus area');
        this.errorasuccess = page.locator('[id="_r_89_-form-item-message"]')
        this.errorservice = page.getByText('You have to select at least');
    }

    async fill(nos:any,focus:string ,success:any){
        await this.yearsofexp.click();
        await this.yrs4.click();
        await this.numofstudreq.fill(nos);
        await this.focusarea.fill(focus);
        await this.successmetricse.fill(success);
        await this.sericeprovidedcareercounseling.click();

    }
    async nextclick(){
        await this.nextbtn.click()
        await this.page.waitForURL('**/register?step=verification');
    }
}