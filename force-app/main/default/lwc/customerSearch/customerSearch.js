import { LightningElement } from 'lwc';
import searchCustomers from '@salesforce/apex/CustomerSearchController.searchCustomers';

export default class CustomerSearch extends LightningElement {
    searchKey = '';
    customers = undefined;
    errorMessage = '';
    isLoading = false;

    handleSearchChange(event) {
        this.searchKey = event.target.value;
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
}