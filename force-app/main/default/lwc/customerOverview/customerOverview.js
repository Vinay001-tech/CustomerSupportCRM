
import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

import ACCOUNT_NAME from '@salesforce/schema/Account.Name';
import ACCOUNT_PHONE from '@salesforce/schema/Account.Phone';
import ACCOUNT_WEBSITE from '@salesforce/schema/Account.Website';
import ACCOUNT_OWNER from '@salesforce/schema/Account.Owner.Name';

const FIELDS = [
    ACCOUNT_NAME,
    ACCOUNT_PHONE,
    ACCOUNT_WEBSITE,
    ACCOUNT_OWNER
];

export default class CustomerOverview extends LightningElement {

    @api recordId;
    isEditMode = false;

    handleEdit(){
        this.isEditMode = true;
    }
    handleCancel(){
        this.isEditMode=false;
    }

    handleSuccess() {
    this.isEditMode = false;
    this.errorMessage = undefined;
    this.dispatchEvent(
        new ShowToastEvent({
            title: 'Success',
            message: 'Customer updated successfully!',
            variant: 'success'
        })
    );
}

    customer;
    errormessage;
    isLoading = true;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredAccount({ data, error }) {

        this.isLoading = false;

        if (data) {

            this.customer = {
                Name: getFieldValue(data, ACCOUNT_NAME),
                Phone: getFieldValue(data, ACCOUNT_PHONE),
                Website: getFieldValue(data, ACCOUNT_WEBSITE),
                OwnerName: getFieldValue(data, ACCOUNT_OWNER)
            };

            this.errormessage = undefined;

        } else if (error) {

            this.customer = undefined;
            this.errormessage = 'Unable to load customer details.';

            console.error(error);
        }
    }
}
