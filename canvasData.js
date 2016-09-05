// ==UserScript==
// @name         Canvas Data
// @namespace    https://portal.inshosteddata.com/
// @version      2016.08.09
// @description  try to take over the world!
// @author       Daniel Gilogley
// @match        https://portal.inshosteddata.com/*
// @grant        none
// ==/UserScript==

$(document).ready(function(){

    var parameters =  getUrlVars();
    //if there are DG paramters, then add the button and allow auto-add
    if(parameters.dgscript === 'true'){
        $('input[value="Create Account"]:first').before('<button type="button" id="dg_addURL" style="margin-right:12px;" class="btn btn-success">Add Canvas Data</button>');
        //Do the thing when the user clicks the button
        $('#dg_addURL').click(function(e){
            e.preventDefault();
            //disable the button
            $('#dg_addURL').attr('disabled',true).attr('class','btn');

            //add the values into the fields
            $('#shard').val(parameters.shard);
            $('#inst-name').val(parameters.url);
            $('#accountId').val(parameters.root);
            $('#region').val(parameters.location);
            
            //focus on button
            $('input[value="Create Account"]:first').focus();
        });
    }

    //add target new window to all links in the table
    $('body > div > div:nth-child(2) > div.col-sm-9.col-md-10.main > div.table-responsive > table > tbody:nth-child(2) > tr > td > a').attr('target','_blank');

});

//Get parametrs from url
function getUrlVars(url) {
    //if no variable, set it to the URL
    if(url === undefined){url = window.location.href;}
    var vars = {};
    var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
