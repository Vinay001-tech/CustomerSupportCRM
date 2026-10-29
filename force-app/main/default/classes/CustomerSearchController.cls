
public with sharing class CustomerSearchController {

    @AuraEnabled(cacheable=true)
    public static List<Account> searchCustomers(String searchKey) {

        if (String.isBlank(searchKey)) {
            return new List<Account>();
        }

        String searchPattern = '%' + searchKey.trim() + '%';

        return [
            SELECT Id, Name, Phone, Website,
                   (SELECT Id, Name, Email, Phone
                    FROM Contacts)
            FROM Account
            WHERE Name LIKE :searchPattern
            ORDER BY Name
            LIMIT 50
        ];
    }
}
