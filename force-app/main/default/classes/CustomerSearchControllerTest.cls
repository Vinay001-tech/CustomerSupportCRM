
@IsTest
private class CustomerSearchControllerTest {

    @IsTest
    static void searchCustomersReturnsMatchingAccounts() {
        Account acc = new Account(Name = 'Technocrats Demo');
        insert acc;

        Contact con = new Contact(
            LastName = 'Test Contact',
            AccountId = acc.Id
        );
        insert con;

        Test.startTest();
        List<Account> results =
            CustomerSearchController.searchCustomers('Technocrats');
        Test.stopTest();

        System.assertEquals(
            1, results.size(),
            'One matching customer should be returned.'
        );
        System.assertEquals(
            'Technocrats Demo', results[0].Name,
            'The matching account name should be returned.'
        );
        System.assertEquals(
            1, results[0].Contacts.size(),
            'The customer should include its contact.'
        );
        System.assertEquals(
            'Test Contact', results[0].Contacts[0].Name,
            'The contact name should be returned.'
        );
    }

    @IsTest
    static void searchCustomersReturnsEmptyForBlankInput() {
        Test.startTest();
        List<Account> results =
            CustomerSearchController.searchCustomers(' ');
        Test.stopTest();

        System.assertEquals(
            0, results.size(),
            'Blank search input should return no customers.'
        );
    }
}
