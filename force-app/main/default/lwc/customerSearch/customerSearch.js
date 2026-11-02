import { LightningElement } from 'lwc';
import searchCustomers from '@salesforce/apex/CustomerSearchController.searchCustomers';
import{ShowToastEvent} from 'lightning/platformShowToastEvent';
import{deleteRecord}from 'lightning/uiRecordApi';
import LightningConfirm from 'lightning/confirm';
import {NavigationMixin} from 'lightning/navigation';

export default class CustomerSearch extends NavigationMixin(LightningElement) {
    searchKey = '';
    customers = undefined;
    errorMessage = '';
    isLoading = false;
    selectedCustomerId = null;

    handleSearchChange(event) {
        this.searchKey = event.target.value;
    }

    handleClear(){
       
        this.searchKey = '';
        const input = this.template.querySelector('lightning-input');
        if(input){
            input.value = '';
        }
        this.customers = undefined;
        this.errorMessage = '';
        this.isLoading = false;
    }

    handleEditClick(event){
         this.selectedCustomerId = event.currentTarget.dataset.id;
    console.log('Selected Customer ID:', this.selectedCustomerId);
       
    }

    handleEditSuccess(){
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success' , message: 'Customer updated successfully! ', variant:'success'
            })
        );
        this.selectedCustomerId = null;
        this.handleSearch();
    }

    handleViewCustomer(event){
        const recordId = event.target.name;
        console.log('Customer Record ID:',recordId);

        if(!recordId){
            console.error('Customer record ID is missing');
            return;
        }

        this[NavigationMixin.Navigate]({
            type : 'standard__recordPage',
            attributes: {
                recordId : recordId,
                objectApiName : 'Account',
                actionName : 'view'
            }
        });
    }

    
    async handleSearch() {
        this.errorMessage = '';
        this.customers = undefined;

        if (!this.searchKey || !this.searchKey.trim()) {
            this.customers = [];
            this.errorMessage = 'Please enter a customer name.';
            return;
        }

        this.isLoading = true;

        try {
            const results = await searchCustomers({
                searchKey: this.searchKey.trim()
            });

            this.customers = results || [];

            if (this.customers.length === 0) {
                this.errorMessage = 'No matching customers found.';
            }
        } catch (error) {
            this.customers = [];
            this.errorMessage =
                error?.body?.message ||
                error?.message ||
                'An unknown error occurred.';
        } finally {
            this.isLoading = false;
        }
    }

    async handleDeleteClick(event){
        const recordId = event.target.name;

        const confirmed = await LightningConfirm.open({
            message: "Are you aure you want to delete this customer? This action cannot be undone.",
            label: 'Confirm Customer Deletion',
            theme: 'warning'
        });
        if(!confirmed){
            return;
        }

        try{
            await deleteRecord(recordId);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Deleted',
                    message : 'Customer deleted successfully.',
                    variant: 'success'
                })
            );
            this.customers = this.customers.filter(customer => customer.id !== recordId);

            if(this.customers.length === 0){
                this.errorMessage = 'No matching customers found.';
            }
        }
        catch(error){
            console.error('Delete Error:',error);
            console.error('Delete Error Details:',
                JSON.stringify(error)
            );
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Delete failed',
                    message: error?.body?.message || error?.message || JSON.stringify(error),
                    variant: 'error',
                    mode : 'sticky'
                })
            );
        }
    }
}