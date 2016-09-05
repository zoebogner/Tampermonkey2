// ==UserScript==
// @name         Canvas (New/Search) - Sydney/Singapore
// @namespace    https://siteadmin.instructure.com/
// @version      2016.08.09
// @description  try to take over the world!
// @author       You
// @match        https://siteadmin.ap-southeast-2.instructure.com/accounts/site_admin/root_accounts*
// @match        https://siteadmin.ap-southeast-1.instructure.com/accounts/site_admin/root_accounts*
// @grant        none
// ==/UserScript==

var getLocation = function(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
};

//determine if on the Syd or Singapore server for Canvas Data
var domain = document.location.host;
if(domain === "siteadmin.ap-southeast-1.instructure.com"){
    domain = "ap-southeast-1";
}else if (domain === "siteadmin.ap-southeast-2.instructure.com"){
    domain = "ap-southeast-2";
}

$(document).ready(function(){
    //Auto add instucture.com
    $('#account_account_domain').after('<br><button type="button" id="dg_addURL" class="btn btn-success">.instructure.com</button>');
    //apply the action of clicking the button
    $('#dg_addURL').click(function(e){
        e.preventDefault();
        $('#dg_addURL').attr('disabled',true).attr('class','btn'); //Disable the button
        $('#account_account_domain').val($('#account_account_domain').val() + '.instructure.com'); //Apply the domain
        $('#account_external_status').val('paid'); //set it to 'Paid'
        return 0;
    });

    //add the id felid after the link
    var splitURL = '';
    var url = '';
    var settings = '';
    $('li.account').each(function(li_index,li_element){
        //add the field
        $('a:first', li_element).after(' <input type="text" name="shard" style="width:5%; height:5px" class="dg_input" onclick="this.select()"> ~ <input type="text" name="tilt" style="width:1%; height:5px" class="dg_input" onclick="this.select()">');

        //calculate the field values
        url = $('a:first', li_element).attr('href');
        splitURL = url.split('/').slice(4,5).join('/').split('~');

        //put the values into the fields
        $('input[name="shard"]', li_element).val(splitURL[0]);
        $('input[name="tilt"]', li_element).val(splitURL[1]);

        //open links in new tab
        $('a:first', li_element).attr('target','_blank');

        //Create the link to Canvas data and settings
        url = getLocation(url);
        settings = url.hostname.split('.instructure.com').join('');
        url = 'https://portal.inshosteddata.com/admin?dgscript=true&shard=' + splitURL[0] + '&url='+ url.hostname.split('.instructure.com').join('') + "&location=" + domain + "&root=" + splitURL[1];

        //link to the data with the parameters
        $('input[name="tilt"]', li_element).after('&nbsp;<a href="'+ url +'" target="_blank">[Data]</a>');

        //link to the page settings
        $('input[name="tilt"]', li_element).after('&nbsp;<a href="https://'+ settings +'.instructure.com/accounts/1/settings/configurations" target="_blank">[Settings]</a>');
    });
});