@isTest
private class CaseTriggerTest {

    @isTest
    static void testStatusPriorityAndOwnerChanges() {

        Account testAccount = new Account(
            Name = 'Test Support Account'
        );
        insert testAccount;

        Case testCase = new Case(
            Subject = 'Test Support Case',
            Status = 'New',
            Origin = 'Phone',
            Priority = 'Low',
            AccountId = testAccount.Id
        );
        insert testCase;

        User anotherUser = [
            SELECT Id
            FROM User
            WHERE IsActive = true
            AND Id != :UserInfo.getUserId()
            LIMIT 1
        ];

        Test.startTest();

        testCase.Status = 'Working';
        testCase.Priority = 'High';
        testCase.OwnerId = anotherUser.Id;
        update testCase;

        Test.stopTest();

        List<Case_Activity_Log__c> logs = [
            SELECT Action_Type__c, Old_Value__c, New_Value__c
            FROM Case_Activity_Log__c
            WHERE Case__c = :testCase.Id
        ];

        System.assertEquals(
            3,
            logs.size(),
            'Expected Status, Priority and Owner change logs.'
        );
    }
}
