trigger CaseTrigger on Case (after update) {
    List<Case_Activity_Log__c> activityLogs =
        new List<Case_Activity_Log__c>();

    for (Case newCase : Trigger.new) {
        Case oldCase = Trigger.oldMap.get(newCase.Id);

        if (newCase.Status != oldCase.Status) {
            activityLogs.add(new Case_Activity_Log__c(
                Case__c = newCase.Id,
                Action_Type__c = 'Status Changed',
                Old_Value__c = oldCase.Status,
                New_Value__c = newCase.Status,
                Changed_By__c = UserInfo.getUserId(),
                Description__c = 'Case status changed from ' +
                    oldCase.Status + ' to ' + newCase.Status
            ));
        }

       if (newCase.Priority != oldCase.Priority) {

    activityLogs.add(new Case_Activity_Log__c(
        Case__c = newCase.Id,
        Action_Type__c = 'Priority Changed',
        Old_Value__c = oldCase.Priority,
        New_Value__c = newCase.Priority,
        Changed_By__c = UserInfo.getUserId(),
        Description__c = 'Case priority changed from ' +
            oldCase.Priority + ' to ' + newCase.Priority
    ));
}

        if (newCase.OwnerId != oldCase.OwnerId) {
       
            activityLogs.add(new Case_Activity_Log__c(
                Case__c = newCase.Id,
                Action_Type__c = 'Owner Changed',
                Old_Value__c = oldCase.OwnerId,
                New_Value__c = newCase.OwnerId,
                Changed_By__c = UserInfo.getUserId(),
                Description__c = 'Case owner changed'
            ));
        }
    }

    if (!activityLogs.isEmpty()) {
        insert activityLogs;
    }
}