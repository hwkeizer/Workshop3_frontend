/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var baseURL = "http://localhost:8080/Workshop3/webresources";
let selectedAccount;
let accountTypes;

$(document).ready(function(){
    showAllAccounts();
    $("#addAccount").click(function(){
        $("#buttons").hide();
        // fill accountTypes with correct accountTypes
        accountTypes = ['KLANT','MEDEWERKER','ADMIN']; 
        // getAvailableAccountTypes werkt nog niet:
//        getAvailableAccountTypes();
        // fill the datalist element with the accountType values
        var list = document.getElementById("accountTypes");
        accountTypes.forEach(function(item) {
            var option = document.createElement('option');
            option.value = item;
            list.appendChild(option);
        });        
        $("#newAccount").show();
    });
    $("#editAccount").click(function(){
        $(".edit_instruction").show();
    });
});

function showAllAccounts() {
//    $.ajaxSetup({ cache: false });
    $.ajax({
        url:baseURL + "/account",
        method: "GET",
        dataType: "json",
        error: function() {
            console.log("Error in function showAllAccounts");
        },
        success: function(data, textStatus, request) {
            if (request.getResponseHeader('REQUIRES_AUTH') === '1'){ 
                window.location.href = 'http://localhost:8080/login.html';
            }
            $("#accounts").tabulator({
                layout:"fitColumns",
                columns:[
                    {title:"Gebruikersnaam", field:"username", headerFilter:"input"},
                    {title:"Wachtwoord", field:"password"},
                    {title:"Type", field:"accountType", headerFilter:"input"}
                ],
                rowClick:function(e, row){
                    $(function () {
                        selectedAccount = {
                            'id' : row.getData().id,
                            'username' : row.getData().username,
                            'password' : row.getData().password,
                            'accountType' : row.getData().accountType
                        };
                        $('#removeAccount').find('#username').val(selectedAccount.username);
                        $('#removeAccount').find('#password').val(selectedAccount.password);
                        $('#removeAccount').find('#accountType').val(selectedAccount.accountType);
                    });
                    $("#buttons").hide();
                    $(".edit_instruction").hide();
                    $("#newAccount").hide();
                    $("#removeAccount").show();                   
                }
            });
            $("#accounts").tabulator("setData", data);
        }       
    });
}

// Process the forms
$(document).on("click", ":submit", function(event) {
    event.preventDefault();
    let account;
    switch($(this).val()) {
        case "Account verwijderen" :
            deleteAccount(selectedAccount.id);
            break;
        case "Account toevoegen" :
            account = {"username":$("#newAccount #username").val(),
                    "password":$("#newAccount #password").val(),
                    "accountType":$("#newAccount #accountType").val()
             };
             createAccount(account);
            break;
    }
});

function deleteAccount(accountId) {
    $.ajax({
        url:baseURL + "/account/" + accountId,
        method: "DELETE",
        contentType: "application/json",
        error: function() {
            console.log("Error in function deleteAccount");
        },
        success: function() {
            window.location.href="http://localhost:8080/account.html#";
            location.reload();
            
        }
    });
}

function createAccount(account) {
    console.log(account);
    $.ajax({
        url:baseURL + "/account",
        method: "POST",
        data: JSON.stringify(account),
        contentType: "application/json",
        error: function() {
            console.log("Error in function createAccount");
        },
        success: function() {
            window.location.href="http://localhost:8080/account.html#";
            location.reload();
            
        }
    });
}
