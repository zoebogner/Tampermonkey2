// ==UserScript==
// @name         Canvas betterments 2 - Create users!
// @namespace    https://siteadmin.instructure.com/
// @version      2018.09.27
// @description  try to take over the world!
// @author       Daniel Gilogley
// @match        https://*.test.instructure.com/*
// @match        https://*.beta.instructure.com/*
// @match        https://*.instructure.com/*
// @match        https://s3.amazonaws.com/SSL_Assets/APAC/ticketpage.html*
// @exclude      https://siteadmin*instructure.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

//global variables
var domain = 'https://' + document.location.hostname;
var userToken = getItem('token');

// If on an instructure page
if (document.location.hostname.indexOf('instructure.com') >= 0) {
    $(document).ready(function() {
        //add the settings link
        $('#menu > li:last').after('<li class="menu-item ic-app-header__menu-list-item" id="dg_li_settings"> <a id="dg_link_settings" href="' + domain + '/accounts/self/settings/configurations" class="ic-app-header__menu-list-link"> <div class="menu-item-icon-container" aria-hidden="true"> <div class="ic-avatar "> <img src="https://cdn3.iconfinder.com/data/icons/fez/512/FEZ-04-128.png" alt="Settings" title = "Settings"></div></div><div class="menu-item__text"> Settings </div></a></li>');

        //add the DG Tools link
        $('#menu > li:last').after('<li class="menu-item ic-app-header__menu-list-item" id="dg_li_self"> <a id="dg_link_self" href="/dgtools2" class="ic-app-header__menu-list-link"> <div class="menu-item-icon-container" aria-hidden="true"> <div class="ic-avatar "> <img src="https://static1.squarespace.com/static/55751873e4b04dc410497087/t/5599db23e4b0af241ed85154/1436146468429/27ef868543abf9c4e16439c1aeb8f0bd.jpg?format=500w" alt="DG Tools" title = "DG Tools"> </div> </div> <div class="menu-item__text"> DG Tools </div></a></li>');

        //remove the images if on the old UI remove the images
        if ($('#menu > li:contains("Dashboard")').length <= 0) {
            $('#dg_li_self img, #dg_li_settings img').hide();
            $('#dg_link_self, #dg_link_settings').attr('class', 'menu-item-no-drop');
        }

        if (document.location.pathname === "/accounts/self/settings" || document.location.pathname === "/accounts/self/settings/configurations" || document.location.pathname === "/accounts/1/settings" || document.location.pathname === "/accounts/1/settings/configurations") { //if on the settings page
            //focus on the settings link
            $('li.ic-app-header__menu-list-item--active').attr('class', "menu-item ic-app-header__menu-list-item");
            $('li#dg_li_settings').attr('class', "menu-item ic-app-header__menu-list-item  ic-app-header__menu-list-item--active");

            //Add a Salesforce link to the Account at the bottom of the page
            $('#account_external_integration_keys_salesforce_account_id').after('<a href="http://instructure.my.salesforce.com/' + $('#account_external_integration_keys_salesforce_account_id').val() + '" target="_blank"><img src="https://cdn.iconverticons.com/files/png/d5b8bf83e9b980e5_256x256.png" style="width: 5%;padding-left: 5px;">');

            //---------On the main Settings page of 'Settings-----------------
            //create the button to do the default settings
            $('#account_settings > legend').after('<button type="button" class ="btn" id="dg_button_applyDefaults_settings">Apply defaults</button>');
            //apply the action of clicking the default button
            $('#dg_button_applyDefaults_settings').click(function(e) {
                e.preventDefault();
                if (confirm("Are you sure?")) {
                    $('#dg_button_applyDefaults_settings').attr('disabled', 'disabled').css('cursor', 'default'); //Disable the button after click

                    //apply the defaults on the settings page
                    $('#account_default_locale').val($('#account_default_locale > option:contains("English (Australia)")').val()); //Default Language
                    $('#account_default_time_zone').val($('#account_default_time_zone option:contains("Sydney (+10:00)")').val()); //Timezone

                    //click some of the features if unchecked
                    $('#account_settings_prevent_course_renaming_by_teachers:not(:checked)').click(); //Prevent teachers from renaming courses
                    $('#account_settings_admins_can_change_passwords:not(:checked)').click();
                    $('#account_settings_admins_can_view_notifications:not(:checked)').click();
                    $('#account_allow_sis_import:not(:checked)').click();
                    $('#account_settings_global_includes:not(:checked)').click();
                    $('#account_settings_enable_profiles:not(:checked)').click();
                    $('#account_settings_sub_account_includes:not(:checked)').click();
                    $('#account_services_analytics:not(:checked)').click();
                    $('#account_services_avatars:not(:checked)').click();
                    $('#account_settings_prevent_course_renaming_by_teachers:not(:checked)').click();

                    //Enabled Web Services to none
                    $('#account_settings > fieldset:contains("Enabled Web Services") > div:not(:last) input[type="checkbox"]:checked').click();

                    //---------On the main Feature page of 'Settings'-----------------
                    //check to see if clicked, and if not click them!

                    //LOR External Tools
                    if ($('#tab-features > div.account-feature-flags > ul div.row-fluid.feature.lor_for_account div.ic-Super-toggle__switch').css('background-color') === "rgb(57, 75, 88)") {
                        $('#tab-features > div.account-feature-flags > ul div.row-fluid.feature.lor_for_account > div.span5.text-right > label > div > div').click();
                    }

                    //internation SMS
                    if ($('#tab-features > div.account-feature-flags > ul div.row-fluid.feature.international_sms div.ic-Super-toggle__switch').css('background-color') === "rgb(57, 75, 88)") {
                        $('#tab-features > div.account-feature-flags > ul div.row-fluid.feature.international_sms > div.span5.text-right > label > div > div').click();
                    }

                    //Wrap Calendar titles
                    if ($('#tab-features > div.account-feature-flags > ul div.row-fluid.feature.wrap_calendar_event_titles div.ic-Super-toggle__switch').css('background-color') === "rgb(57, 75, 88)") {
                        $('#tab-features > div.account-feature-flags > ul div.row-fluid.feature.wrap_calendar_event_titles > div.span5.text-right > label > div > div').click();
                    }

                    //Canvas Parent
                    if ($('#tab-features > div.account-feature-flags > ul div.row-fluid.feature.canvas_parent div.ic-Super-toggle__switch').css('background-color') === "rgb(57, 75, 88)") {
                        $('#tab-features > div.account-feature-flags > ul div.row-fluid.feature.canvas_parent > div.span5.text-right > label > div > div').click();
                    }

                    //focus on the submit button
                    $('html,body').animate({
                        scrollTop: $('#account_settings > div.button-container > button').offset().top
                    }, 'slow');

                    //Notification to user
                    $('#account_settings > div.button-container').append('<span><marquee direction="right" loop="20" width="45%"><em>Yes, it`s even applied the Features too!</em></marquee></span>');

                    //Dashboard images
                    $('div.row-fluid.feature.course_card_images div.ff-background:contains("On") span.ui-button-text').click();

                    //Recurring Calendar Events
                    $('div.row-fluid.feature.recurring_calendar_events div.ff-background:contains("Allow") span.ui-button-text').click();

                    // Multiple Grading Periods
                    $('div.row-fluid.feature.multiple_grading_periods div.ff-background:contains("Allow") span.ui-button-text').click();

                    //Display Totals for "All Grading Periods"
                    $('div.row-fluid.feature.all_grading_periods_totals div.ff-background:contains("Allow") span.ui-button-text').click();

                    //Apply the email display name to the account name
                    $('#account_settings_outgoing_email_default_name_option_custom').click();
                    $('#account_settings_outgoing_email_default_name').val('Canvas @ ' + $('input[name="account[name]"]').val());

                    //Faculty Journel
                    $('#account_enable_user_notes:not(:checked)').click();
                    //Turn on Scheduler
                    $('#account_settings_show_scheduler:not(:checked)').click();
                    //Users cant edit their name
                    $('#account_settings_users_can_edit_name:checked').click();
                    //Users cant delete their default email
                    $('#account_settings_edit_institution_email:checked').click();

                    //features
                    //LTI2 Registration
                    $('#tab-features > div.account-feature-flags > ul > li:nth-child(8) > div.row-fluid.feature.lti2_rereg > div.span5.text-right > label > div > div > div.ic-Super-toggle__option--RIGHT').click();

                    //Use the new scheduler
                    $('#tab-features > div.account-feature-flags > ul > li:nth-child(12) > div.row-fluid.feature.better_scheduler > div.span5.text-right > label > div > div > div.ic-Super-toggle__option--RIGHT').click();

                    //Student Context Card
                    $('#tab-features > div.account-feature-flags > ul > li:nth-child(18) > div.row-fluid.feature.student_context_cards > div.span5.text-right > label > div > div > div.ic-Super-toggle__option--RIGHT').click();

                    //Toggle feature details for New User Tutorial
                    $('#tab-features > div.account-feature-flags > ul > li:nth-child(19) > div.row-fluid.feature.new_user_tutorial > div.span5.text-right > label > div > div > div.ic-Super-toggle__option--RIGHT').click();

                    //Send Authorization URL in LTI2 Registration
                    $('#tab-features > div.account-feature-flags > ul > li:nth-child(21) > div.row-fluid.feature.lti_2_auth_url_registration > div.span5.text-right > label > div > div > div.ic-Super-toggle__option--RIGHT').click();

                } else {
                    return 0;
                }
            });
            //----------End do the apply default button -----------------------

            //Changes to the 'Apps' tab  - only if you click on my settings link, and did not navigate there natuarally
            $('#account_settings_tabs > ul > li:contains("Apps"):first > a:first').click(function(a) {
                a.preventDefault();
                setTimeout(function() {
                    $('#external_tools > div > div > div.Header > h2 > div > span.AddExternalToolButton > a.btn.btn-primary.add_tool_link.lm').click(function(b) {
                        b.preventDefault();
                        setTimeout(function() {
                            $('body > div.ReactModalPortal > div > div > div > div > div.ReactModal__Header-Title > h4').after('<button type="button" id="dg_button_canvasCommons">Canvas Commons</button>');
                            var name = "Commons Setup";
                            var consumerKey = "1";
                            var sharedSecret = "c9b6c488-4750-48ce-897c-b919ff3cb0f1";
                            var configURL = "https://lor.instructure.com/api/account-setup/tool-config";
                            $('#dg_button_canvasCommons').click(function(c) {
                                c.preventDefault();
                                $('#dg_button_canvasCommons').attr('disabled', 'disabled').css('cursor', 'default'); //Disable the button after click

                                //select URL
                                $('#configuration_type_selector-bs > ul > li:nth-child(2) > a').click();
                                //apply the values to the fields
                                $('body > div.ReactModalPortal > div > div > div > form > div.ReactModal__Body > div.formFields > div > div:nth-child(1) > label > input[placeholder="Name"]:first').val(name);
                                $('body > div.ReactModalPortal > div > div > div > form > div.ReactModal__Body > div.formFields > div > div:nth-child(2) > div:nth-child(1) > div > label > input[placeholder="Consumer key"]').val(consumerKey);
                                $('body > div.ReactModalPortal > div > div > div > form > div.ReactModal__Body > div.formFields > div > div:nth-child(2) > div:nth-child(2) > div > label > input[placeholder="Shared Secret"]').val(sharedSecret);
                                $('body > div.ReactModalPortal > div > div > div > form > div.ReactModal__Body > div.formFields > div > div:nth-child(3) > label > input[placeholder="Config URL"]').val(configURL); //*/

                                //focus on the submit
                                $('body > div.ReactModalPortal > div > div > div > form > div.ReactModal__Footer > div > button.btn.btn-primary').focus();
                            });
                        }, 100);
                    });
                }, 100);
            });
        }

        //Add Auth changer to users
        if (document.location.pathname.indexOf("/accounts/self/users/") >= 0 || document.location.pathname.indexOf("/users/") >=0 || document.location.pathname.indexOf("/accounts/1/users/") >= 0) {
            //figure out how many logins there are and create a select list for them
            var optionCountHTML = '<option value="null">Select a login</option>';
            for (var i = 1; i <= $('fieldset#login_information > table.ic-Table > tbody > tr.login:not(:last)').length; i++) {
                optionCountHTML += '<option value="' + i + '">' + i + '</option>';
            }
            optionCountHTML = '<select class="locale" id="dg_changeAuthCount" style="width:initial;">' + optionCountHTML + '</select>';
            //Create the auth method select for Canvas, LDAP, SAML, Microsoft, and Google
            var changeAuthSelect = '<select class="locale" name="dg_changeAuth" id="dg_changeAuth" style="width:initial;"><option value="null">Select an Auth method</option><option value="canvas">Canvas</option><option value="ldap">LDAP</option><option value="saml">SAML</option><option value="microsoft">Microsoft (Office 365)</option><option value="google">Google</option></select>';
            //Put in the option to the page for the  auth method
            $('#name_and_email > table > tbody > tr:last').after('<tr id="dg_changeAuth_tr"><br><td><label for="dg_changeAuth">Change authentication:</label></td><td>' + changeAuthSelect + '</td></tr>');
            //put in the options dropdown
            $('#dg_changeAuth_tr').append('<td id="dg_changeAuthCount_td">' + optionCountHTML + '</td>');
            //add the 'Go' button
            $('#dg_changeAuthCount_td').after('<td><input type="checkbox" value="true" unchecked="true" name="dg_deleteOldAuthMethod" id="dg_deleteOldAuthMethod"><span>Delete old Method</span></td><td><button id="dg_changeAuth_button" class="btn" style="bottom: 5px;">Go</button></td>');
            //When you click the 'Go' button
            $('#dg_changeAuth_button').click(function(e) {
                e.preventDefault();
                //disable the options
                $('#dg_changeAuth_button,#dg_changeAuth,#dg_deleteOldAuthMethod,#dg_changeAuthCount').attr('disabled', 'disabled');
                //replace the 'Go' button with the spinny wheel
                $('#dg_changeAuth_button').html('<body id="dg_spin"><div class="loading_image_holder"><img src="/images/ajax-loader.gif"></div>');
                //check to see a proper value is selected
                if ($('#dg_changeAuth').val() === "null" || $('#dg_changeAuthCount').val() === "null") {
                    alert('No Auth method or Number selected!');
                    return;
                } else {
                    var currentUserID = ENV.USER_ID;
                    var authMethodSelected = $('#dg_changeAuth').val();
                    var authMethodNumber = $('#dg_changeAuthCount').val();
                    var authDeleteOld = $('#dg_deleteOldAuthMethod:checked').length;
                    var loginID = $('fieldset#login_information > table.ic-Table > tbody > tr.login:eq(' + (authMethodNumber - 1) + ') b.unique_id').text().trim();
                    var sisID = $('fieldset#login_information > table.ic-Table > tbody > tr.login:eq(' + (authMethodNumber - 1) + ') th[scope="row"] div:eq(0)').text().trim().split('SIS ID: ').join('');

                    //if no SIS id, then SIS id is login ID
                    if (sisID === "SIS ID:") {
                        sisID = loginID;
                    } else {
                        sisID += "_" + authMethodSelected;
                    }

                    var integrationID = $('fieldset#login_information > table.ic-Table > tbody > tr.login:eq(' + (authMethodNumber - 1) + ') th[scope="row"] div:last').text().trim().split('Integration ID: ').join('');
                    //if not Integration ID then it equalls null
                    if (integrationID === "Integration ID:") integrationID = '';

                    //if deleted, then delete the old login method
                    if (authDeleteOld >= 1) {
                        $('fieldset#login_information > table.ic-Table > tbody > tr.login:eq(' + (authMethodNumber - 1) + ') a.delete_pseudonym_link').click();
                    }

                    //build the string for the POST
                    var postString = '/api/v1/accounts/self/logins?' + encodeURI('user[id]=' + currentUserID); //which users
                    postString += encodeURI("&login[authentication_provider_id]=" + authMethodSelected); //login[authentication_provider_id]
                    postString += encodeURI("&login[unique_id]=" + loginID); //login ID
                    postString += encodeURI("&login[sis_user_id]=" + sisID); //login[sis_user_id]
                    postString += encodeURI("&login[integration_id]=" + integrationID); //login[integration_id]
                    console.log(decodeURI(postString));

                    //post the API call
                    var data = null;
                    var xhr = new XMLHttpRequest();
                    xhr.withCredentials = true;
                    xhr.addEventListener("readystatechange", function() {
                        if (this.readyState === 4) {
                            console.log(this.responseText);
                            alert(this.responseText);
                            location.reload();
                        }
                    });
                    xhr.open("POST", postString);
                    xhr.setRequestHeader("authorization", "Bearer " + userToken);
                    xhr.setRequestHeader("cache-control", "no-cache");
                    xhr.send(data);
                }
            });
        } else if (document.location.pathname.toLowerCase() === "/accounts/1/settings/configurations" || document.location.pathname.toLowerCase() === "/accounts/1/settings" || document.location.pathname.toLowerCase().indexOf("/accounts/self/") >=0 ) {
            //token storage and update
            var tokenInputHTML = '<label for="dg_apiToken">API token:</label><div class="ic-Input-group"><input name="focus" type="hidden" value="' + userToken + '"><input id="dg_apiToken" type="text" name="dg_apiToken" class="ic-Input ui-autocomplete-input" value="' + userToken + '" aria-labelledby="course_name_label" autocomplete="off"><button class="Button" id="dg_apiTokenButton">Update</button></div><br>';
            $('#right-side').prepend(tokenInputHTML);
            $('#dg_apiTokenButton').click(function(e) {
                e.preventDefault();
                if (confirm("Update token with: " + $('#dg_apiToken').val())) {
                    storeItem('token', $('#dg_apiToken').val());
                    location.reload();
                }
                return;
            });
        } else if (document.location.pathname.toLowerCase() === "/dgtools") {
            //focus on the DG links page
            $('li.ic-app-header__menu-list-item--active').attr('class', "menu-item ic-app-header__menu-list-item");
            $('li#dg_li_self').attr('class', "menu-item ic-app-header__menu-list-item  ic-app-header__menu-list-item--active");

            document.title = "DG - Update User SIS id from one to another";
            $('#main').html('<div> <h1>Update User SIS id from one to another</h1> <div style="padding-left:50px;"> <table> <tr> <th>Old SIS ID / Canvas ID</th> <th>New SIS ID</th> <th>Console Log</th> </tr> <tr> <td> <textarea id="dg_old_sis_id" rows="20" cols="50"></textarea> </td> <td> <textarea id="dg_new_sis_id" rows="20" cols="50"></textarea> </td> <td> <textarea id="dg_console_log" rows="20" cols="150" disabled="disabled" style="width:100%;"></textarea> </td> </tr> <tr> <td> <label for="dg_apiToken">API token:</label> <br> <input id="dg_apiToken" type="text" name="dg_apiToken" value="' + userToken + '" autocomplete="off" cols="50" disabled="disabled"> </td> <td> <label for="dg_apiToken">SIS ID or Canvas ID:</label> <br> <select id="dg_canvasOrSIS" name="dg_canvasOrSIS"> <option value="sis_user_id:">SIS ID</option> <option value="">Canvas ID</option> </select> </td> <td> <br> <button type="button" id="dg_updateGo" class="btn filter_button">Update IDs</button> </td> </tr> </table> </div> <div style="padding-left:50px;" >Useful links; <ul> <li>Case convert: <a href="https://convertcase.net/" target="_blank">https://convertcase.net/</a> </li> <li>Convert Column to Comma Separated List: <a href="https://convert.town/column-to-comma-separated-list" target="_blank">https://convert.town/column-to-comma-separated-list</a> </li> </ul> </div> </div>');

            $('button#dg_updateGo').click(function(e) {
                e.preventDefault();
                //disable fields and buttons
                $('button#dg_updateGo, #dg_old_sis_id, #dg_new_sis_id, #dg_canvasOrSIS').attr('disabled', 'disabled');

                //get the arrays and confrim that they match
                var old_sis_ID = csvOrNot($('#dg_old_sis_id').val());
                var new_sis_ID = csvOrNot($('#dg_new_sis_id').val());

                //create new object array
                var newObjectArray = [];

                if (old_sis_ID.length === new_sis_ID.length) {
                    $.each(old_sis_ID, function(i, e) {
                        var tmp = {
                            new: new_sis_ID[i].trim(),
                            old: e.trim()
                        };
                        newObjectArray.push(tmp);
                    });
                    if (confirm("Are you sure?\nThis can't be undone?")) {
                        update_sis_id(newObjectArray, $('#dg_canvasOrSIS').val());
                    } else {
                        return 0;
                    }
                } else {
                    return alert('Array lengths do not match!');
                }
            });
        } else if(document.location.pathname.toLowerCase() === "/dgtools2") {
            document.title = "DG Tools";
            $('#main').html('<center>    <h1>DG Tools</h1>    <div><em>DG Tools are the best!</em></div></center><div style="padding-left:50px">    <hr>    <h2>Links</h2>    <ul>        <li><a href="/dgtools">Update User SIS id from one to another</a></li>        <li><a href="/dgtools3">Create Users</a></li>        <li><a href="/dgtools4">Create Sandboxes</a></li>        <li><a href="https://instructure.atlassian.net/wiki/display/ENG/SCORM" target="_blank">SCORM Setup</a></li>        <li><a href="/accounts/self/settings/configurations#tab-tools" target="_blank">LTI Tool Config Settings Page</a></li>    </ul>    <h2>Tools</h2>    <ul>        <li class="dg_action_lti">            <button class="Button" type="button" id="dg_button_cc" key="1" secret="c9b6c488-4750-48ce-897c-b919ff3cb0f1" url="https://lor.instructure.com/api/account-setup/tool-config">Canvas Commons</button>        </li>        <li><strong>Sydney</strong></li>        <ul>            <li class="dg_action_lti">                <button class="Button" type="button" id="dg_button_syd_chat" key="5436" secret="AA7UiLCv5QQ63pQ7gWhIEZwiK0wE9bMUB35BT9JOi7zeW2GtIlJB7SkWttYirL1exa2NrN7Xkzu3O4dZlTRfJv9C" url="https://chat-syd.instructure.com/lti/configure.xml">Chat LTI (SYD)</button>            </li>            <li class="dg_action_lti">                <button class="Button" type="button" id="dg_button_syd_rollCall" key="6edd0a5c8f95ff156168af6db62bf4fe4b404343bc3a7525e5a990d016c0a4c6" secret="49ba3d056fa0b4939aa1018dfeaf09211e922f1164d2c358daf624a9aed2fa2a" url="https://rollcall-syd.instructure.com/configure.xml">Roll Call - Attendance (SYD)</button>            </li>            <li class="dg_action_lti">                <button class="Button" type="button" id="dg_button_syd_arcApac" key="2289-1ed35fef912ddbda644bac58387a3cb124b18c3d9fbca935ebda2822e13f4f52" secret="5df67ea01c3fc7ed632b177a8255210bd8397b9f749778ca608a8b062a6cedfb" url="https://apaccs.instructuremedia.com/lti/config.xml">ARC for APAC CS New Employees</button>            </li>            <li class="dg_action_outcome">                <button class="Button" type="button" id="dg_button_syd_outcomes" guid="A8326BEC-901A-11DF-A622-0C319DFF4B22">Australian Outcomes</button>            </li>            <li class="dg_action_externalTool">                <button class="Button" type="button" id="dg_button_syd_office365" destination="https://office365-syd-prod.instructure.com" url="https://office365-syd-prod.instructure.com/config.xml">MS Office 365 LTI (SYD)</button>            </li>            <li class="dg_action_externalTool">                <button class="Button" type="button" id="dg_button_syd_google" destination="https://google-drive-lti-syd-prod.instructure.com/lti_credentials/new" url="https://google-drive-lti-syd-prod.instructure.com/config">Google LTI (SYD)</button>            </li>        </ul>        <li><strong>Singapore</strong></li>        <ul>            <li class="dg_action_lti">                <button class="Button" type="button" id="dg_button_sg_chat" key="5437" secret="21b2b6008685d7ced7319af8e1349d52b40808cef67e36a6068065c87c13309803adb82c5c880d8f7d928776" url="https://rollcall-sin.instructure.com/configure.xml">Chat LTI (SG)</button>            </li>            <li class="dg_action_lti">                <button class="Button" type="button" id="dg_button_sg_rollCall" key="6edd0a5c8f95ff156168af6db62bf4fe4b404343bc3a7525e5a990d016c0a4c6" secret="49ba3d056fa0b4939aa1018dfeaf09211e922f1164d2c358daf624a9aed2fa2a" url="https://rollcall-sin.instructure.com/configure.xml">Roll Call - Attendence (SG)</button>            </li>            <li class="dg_action_externalTool">                <button class="Button" type="button" id="dg_button_sg_office365" destination="https://office365-sin-prod.instructure.com" url="https://office365-sin-prod.instructure.com/config.xml">MS Office 365 LTI (SG)</button>            </li>            <li class="dg_action_externalTool">                <button class="Button" type="button" id="dg_button_sg_google" destination="https://google-drive-lti-sin-prod.instructure.com/lti_credentials/new" url="https://google-drive-lti-sin-prod.instructure.com/config">Google LTI (SG)</button>            </li>        </ul>    </ul></div><hr><div style="padding-left:50px;width: 40%">    <label for="dg_apiToken">API token:</label>    <div class="ic-Input-group">        <input name="focus" type="hidden" value="' + userToken + '">        <input id="dg_apiToken" type="text" name="dg_apiToken" class="ic-Input ui-autocomplete-input" value="' + userToken + '" aria-labelledby="course_name_label" autocomplete="off">        <button class="Button" id="dg_apiTokenButton">Update API Token</button>    </div>    <br>    <br></div>');

            //LTI Buttons Function
            $('li.dg_action_lti').click(function(e){
                e.preventDefault();
                console.log("Installing this Tool: " + $(this).text());
                console.log("Key: " + $("button", this).attr("key"));
                console.log("Secret: " + $("button", this).attr("secret"));
                console.log("URL: " + $("button", this).attr("url"));

                //Disable the button
                $("button", this).attr("disabled","disabled");

                //Call the function to insall LTI based on the paramters in the HTML Buttons
                installLTI($(this).text(), $("button", this).attr('key'), $("button", this).attr('secret'), $("button", this).attr('url'));
            });

            //Outcomes Install
            $('li.dg_action_outcome').click(function(e){
                e.preventDefault();
                console.log('Installing outcomes: ' + $(this).text());
                //Disable the button
                $("button", this).attr("disabled","disabled");
                outcomesAPI($('button',this).attr('guid'));
            });

            //External tool link (Office365 / GAFE)
            $('li.dg_action_externalTool').click(function(e){
                e.preventDefault();
                $("button", this).attr("disabled","disabled");
                // ========= WIP ================
                // ==============================
                //Just open up thr right pages for now
                window.open($('button',this).attr('destination'), "_blank"); //Place to Generate tokens
                window.open($('button',this).attr('url'), "_blank"); //Config XML
                window.open("/accounts/self/settings/configurations#tab-tools", "_blank"); //Config Page
            });

            //Update Token function
            $('#dg_apiTokenButton').click(function(e) {
                e.preventDefault();
                if (confirm("Update token with: " + $('#dg_apiToken').val())) {
                    storeItem('token', $('#dg_apiToken').val());
                    location.reload();
                }
                return;
            });
        }else if(document.location.pathname.toLowerCase() === "/dgtools3") {
            //Create users page
            document.title="DG - Create Users"
            $('#main').html('<div>   <h1>Create Users</h1>   <div style="padding-left:50px;">      <table>         <tr>            <th>First Name</th>            <th>Last Name</th>            <th>User ID</th>            <th>Login ID</th>            <th>Email Address</th>         </tr>         <tr>            <td><textarea rows="10" id="dg_first_name" ></textarea></td>            <td><textarea rows="10"id="dg_last_name"></textarea></td>            <td><textarea id="dg_user_id" rows="10"></textarea></td>            <td><textarea id="dg_login_id" rows="10"></textarea></td>            <td><textarea id="dg_email" rows="10"></textarea></td>         </tr>         <tr>            <td> <label for="dg_apiToken">API token:</label> <br> <input id="dg_apiToken" type="text" name="dg_apiToken" value="' + userToken + '" autocomplete="off" cols="50" disabled="disabled"> </td>            <td>               <label for="dg_apiToken">Auth Provider ID:</label> <br>                <select class="locale" name="dg_set_auth" id="dg_set_auth" style="width:initial;">                  <option value="">Null</option>                  <option value="canvas">Canvas</option>                  <option value="ldap">LDAP</option>                  <option value="saml">SAML</option>                  <option value="microsoft">Microsoft (Office 365)</option>                  <option value="google">Google</option>                  <option value="openid_connect">OpenID Connect</option>               </select>            </td>            <td> <br> <button type="button" id="dg_create_users" class="btn filter_button">Create Users</button> </td>         </tr>      </table>      <div><h3>Console Log</h3>         <textarea id="dg_console_log" rows="10" cols="150" disabled="disabled" style="width:80%;"></textarea>      </div>   </div>   <div style="padding-left:50px;" >      Useful links;       <ul>         <li>Case convert: <a href="https://convertcase.net/" target="_blank">https://convertcase.net/</a> </li>         <li>Convert Column to Comma Separated List: <a href="https://convert.town/column-to-comma-separated-list" target="_blank">https://convert.town/column-to-comma-separated-list</a> </li>      </ul>   </div><br><br></div>');
            $('button#dg_create_users').click(function(e) {
                e.preventDefault();
                //disable fields and buttons
                $('#dg_create_users,#dg_set_auth,#dg_first_name,#dg_last_name,#dg_login_id,#dg_user_id,#dg_email').attr('disabled', 'disabled');

                //get the arrays and confrim that they match
                var first_name = csvOrNot($('#dg_first_name').val());
                var last_name = csvOrNot($('#dg_last_name').val());
                var login_id = csvOrNot($('#dg_login_id').val());
                var user_id = csvOrNot($('#dg_user_id').val());
                var email = csvOrNot($('#dg_email').val());
                var auth_id = $('#dg_set_auth').val();

                //create new object array
                var createNewUserArray = [];

                if (user_id.length === first_name.length) {
                    $.each(user_id, function(i, e) {
                        var tmp = {
                            first_name: user_id[i].trim(),
                            last_name: last_name[i].trim(),
                            full_name: first_name[i].trim() + ' ' + last_name[i].trim(),
                            login_id: login_id[i].trim(),
                            user_id: user_id[i].trim(),
                            email: email[i].trim(),
                            auth_id:auth_id
                        };
                        createNewUserArray.push(tmp);
                    });
                    if (confirm("Are you sure?\nThis can't be undone?")) {
                        //main function
                        //Main create users
                        createUsers(createNewUserArray);
                    } else {
                        return 0;
                    }
                } else {
                    return alert('Array lengths do not match!');
                }
            });
        }if(document.location.pathname.toLowerCase() === "/dgtools4") {
            document.title="DG - Create Sandboxes";
            $('#main').html('<div>   <h1>Create Users</h1>   <div style="padding-left:50px;">      <table>         <tr>           <li><button class="Button" type="button" id="dg_button_create_sandbox">Create Sandbox Sub-Account</button></li>           <li><button class="Button" type="button" id="dg_button_create_canvas101">Create Canvas 101</button></li>         </tr>         <tr>            <th>User ID</th>         </tr>         <tr>            <td><textarea id="dg_user_id" rows="10"></textarea></td>         </tr>         <tr>            <td> <label for="dg_apiToken">API token:</label> <br> <input id="dg_apiToken" type="text" name="dg_apiToken" value="' + userToken + '" autocomplete="off" cols="50" disabled="disabled"> </td>            <td>               <label for="dg_canvas101">Enrol in Canvas 101 (Growing with Canvas)</label> <br>                <select class="locale" name="dg_canvas101" id="dg_canvas101" style="width:initial;">                  <option value="true">Yes</option>                  <option value="false">No</option>               </select>            </td>            <td> <br> <button type="button" id="dg_create_sandboxes" class="btn filter_button">Create Sandboxes</button> </td>         </tr>      </table>      <div><h3>Console Log</h3>         <textarea id="dg_console_log" rows="10" cols="150" disabled="disabled" style="width:80%;"></textarea>      </div>   </div>   <div style="padding-left:50px;" >      Useful links;       <ul>         <li>Case convert: <a href="https://convertcase.net/" target="_blank">https://convertcase.net/</a> </li>         <li>Convert Column to Comma Separated List: <a href="https://convert.town/column-to-comma-separated-list" target="_blank">https://convert.town/column-to-comma-separated-list</a> </li>      </ul>   </div></div>');
            //Create canavs101 Button
            $('#dg_button_create_canvas101').click(function(){
                $('#dg_button_create_canvas101').attr('disabled','disabled');
                var createCanvas101 = createCanvasCourse("Canvas 101","canvas101","sandbox","Growing With Canvas",null);
            });

            //Create Sandbox Account
            $('#dg_button_create_sandbox').click(function(){
                $('#dg_button_create_sandbox').attr('disabled','disabled');
                var createSandbox = createSandboxAccount();
            });

            //create Sandboxes function
            $('#dg_create_sandboxes').click(function(){
                $('#dg_create_sandboxes, #dg_user_id, #dg_canvas101').attr('disabled','disabled');
                var userID_array = csvOrNot($('#dg_user_id').val());
                var alsoCanvas101 = $('#dg_canvas101').val();
                sandboxCreate(userID_array,alsoCanvas101);
            });
        }

        //link to the IC support page within the Canvas help
        $($('#global_nav_help_link').parent()).click(function() {
            //check to see if the link has been made, as the canvas help only renders on the help link click!
            if ($('#dg_icSupportLink').length === 0) {

                var buildIcLink = [];
                var linkURL = "https://s3.amazonaws.com/SSL_Assets/APAC/ticketpage.html";

                //get the account object information
                var settings = {
                    "async": true,
                    "crossDomain": false,
                    "url": "/api/v1/accounts/self",
                    "method": "GET",
                    "headers": {
                        "cache-control": "no-cache",
                    }
                };

                $.ajax(settings).done(function(response) {
                    buildIcLink = {
                        dgtools: true,
                        name: response.name,
                        currentURL: document.location.toString(),
                        DOMAIN_ROOT_ACCOUNT_ID: ENV.DOMAIN_ROOT_ACCOUNT_ID,
                        CONTEXT_BASE_URL: ENV.CONTEXT_BASE_URL,
                        TIMEZONE: ENV.TIMEZONE,
                        //currentAccount: ENV.ACCOUNT.id, //looks like this doesnt always exist
                        current_user_id: ENV.current_user_id,
                        documentTitle: document.title,
                    };
                    //build the support link URI
                    linkURL = buildURI(buildIcLink, linkURL);
                    console.log(linkURL);
                    $('#help_tray > ul:first > li:first').before('<li class="ic-NavMenu-list-item"><a id="#dg_icSupportLink" href="' + linkURL + '" target="_blank" class="ic-NavMenu-list-item__link">IC Support</a><div class="ic-NavMenu-list-item__helper-text is-help-link">Link to the IC support page</div></li>');
                });
            }
            return;
        });

        //if within a course
        if(document.location.pathname.toLowerCase().indexOf('/courses/') >= 0){

            if(document.location.pathname.toLowerCase() === "/courses/" + ENV.course_id){
                //If on the homepage of the course

                //Settings link above the options on RHS
                $('#course_show_secondary > div.course-options > a.btn.button-sidebar-wide.course-home-sub-navigation-lti:last').before('<a href="/courses/' + ENV.course_id + '/settings" class="btn button-sidebar-wide course-home-sub-navigation-lti"><i class="icon-link"></i> Course Settings</a>');
                //Undelete option
                $('#course_show_secondary > div.course-options > a.btn.button-sidebar-wide.course-home-sub-navigation-lti:last').before('<a href="/courses/' + ENV.course_id + '/undelete" class="btn button-sidebar-wide course-home-sub-navigation-lti"><i class="icon-link"></i> Undelete Course Content</a>');
            }
        }

    });
    // ELSE if on the IC request page
} else if (document.location.hostname === "s3.amazonaws.com") {
    if (typeof jQuery == 'undefined' || typeof jQuery === undefined || typeof jQuery === null) {
        var headTag = document.getElementsByTagName("head")[0];
        var jqTag = document.createElement('script');
        jqTag.type = 'text/javascript';
        jqTag.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js';
        headTag.appendChild(jqTag);
        jqTag.onload = myJQueryCode;
    }else{
        myJQueryCode();
    }

    function myJQueryCode() {
        $(document).ready(function() {
            //document title and favicon
            document.title="APAC IC Support";
            (function() {
                var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
                link.type = 'image/x-icon';
                link.rel = 'shortcut icon';
                link.href = 'http://www.favicon.cc/logo3d/170779.png';
                document.getElementsByTagName('head')[0].appendChild(link);
            })();

            //fix up some formating
            $('.form-control:not(:last)').css({"display":"-webkit-inline-box","width":"inherit","max-width":"100%", "height": "inherit","padding":"inherit"});
            $('.help-block, #other_details_chars_label').hide();
            $('.form-horizontal, .form-group').css({'margin-right':'inherit','margin-left':'inherit'});


            var icSupportObject = getUrlVars();

            //if done via DG tools
            if (icSupportObject.dgtools == "true") {
                console.log('gg');
                //fill out the title field
                $('#school_name').val(icSupportObject.name);

                //fill the URL field
                $('#canvas_URL').val(icSupportObject.currentURL);

                //create the support details string
                var supportDetails = JSON.stringify(icSupportObject);
                supportDetails = supportDetails.split('","').join('\n').split('":"').join(' : ').split('"}').join('').split('{"').join('').trim();

                $('#other_details').val('\n\n\n===================================\n' + supportDetails);
            }
        });
    }
}

// My functions
function storeItem(storeName, storeValue) {
    storeValue = btoa(storeValue);
    //localStorage.setItem(storeName, storeValue);
    GM_setValue(storeName, storeValue);
    //console.log("Encoded name: " + storeName + "\nEncoded Value: " + storeValue);
    return true;
}

function getItem(itemName) {
    //var retrievedObject = localStorage.getItem(itemName);
    var retrievedObject = GM_getValue(itemName, null);
    if (retrievedObject !== null) retrievedObject = atob(retrievedObject);
    //console.log("Decoded itme Name: " + itemName + "\nDecoded value: " + retrievedObject);
    return retrievedObject;
}

function update_sis_id(userArray, sisOrNot) {
    //itterate through the array of canvas IDs
    $.each(userArray, function(index, element) {
        var settingsGET = {
            "async": true,
            "url": "/api/v1/users/"+ sisOrNot + element.old + '/logins/',
            "method": "GET",
            "headers": {
                "authorization": "Bearer " + userToken,
                "cache-control": "no-cache"
            },
            "error": function(jqXHR, textStatus, errorThrown) {
                if (jqXHR.status == 404 || errorThrown == 'Not Found') {
                    console.log("Error: " + jqXHR.status + " - User not found: " + element.old);
                    $('#dg_console_log').val("Error: " + jqXHR.status + " - User not found: " + element.old + " \n" + $('#dg_console_log').val());
                }
            }
        };

        $.ajax(settingsGET).done(function(response) {
            var data = null;

            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;

            xhr.addEventListener("readystatechange", function() {
                if (this.readyState === 4) {
                    console.log("Completed id update for: " + this.responseText);
                    $('#dg_console_log').val("Completed id update for: " + element.new + " [" + element.old + "]\n" + $('#dg_console_log').val());
                }
            });


            xhr.open("PUT", "/api/v1/accounts/self/logins/" + response[0].id + encodeURI("?login[sis_user_id]=") + element.new);
            xhr.setRequestHeader("authorization", "Bearer " + userToken);
            xhr.setRequestHeader("cache-control", "no-cache");
            xhr.send(data);
            console.log("Processing for: " + element.new + "[" + element.old + "]");
            $('#dg_console_log').val("Processing for: " + element.new + "[" + element.old + "]\n" + $('#dg_console_log').val());
        });
    });
}

//build the URI string from the object array
function buildURI(passedObject, baseURL) {
    var str = "?" + Object.keys(passedObject).map(function(prop) {
        return [prop, passedObject[prop]].map(encodeURIComponent).join("=");
    }).join("&");

    if (baseURL === null || baseURL === undefined || baseURL === '' || baseURL === 'undefined')
        return str;
    else
        return baseURL + str;
}

//Get parametrs from url
function getUrlVars(url) {
    //if no variable, set it to the URL
    if (url === undefined) {
        url = window.location.href;
    }

    var vars = {};
    var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[key] = decodeURIComponent(value);
    });
    return vars;
}

//determine if the text area is new line or csv and return an array
function csvOrNot(theTextArea){
    var newArray = theTextArea.trim();
    if(newArray.indexOf('\n') > newArray.indexOf(',')){
        newArray = newArray.split(' \n').join('\n');
        newArray = newArray.split('\n ').join('\n');
        newArray = newArray.split('\n');
        return newArray;
    }else {
        newArray = newArray.split(' ,').join(',');
        newArray = newArray.split(', ').join(',');
        newArray = newArray.split(',');
        return newArray;
    }
}

//Install LTIs that use URL Install
function installLTI(name,consumer_key,shared_secret,config_url){
    var data = null;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
            alert(this.responseText);
            if(name === "Canvas Commons"){
                window.open("/accounts/self/settings/configurations#tab-tools", "_blank");
            }
        }
    });

    //Build the API Call
    var apiURL = "/api/v1/accounts/self/external_tools?name=";
    apiURL += encodeURI(name) + "&privacy_level=public&consumer_key=";
    apiURL += encodeURI(consumer_key) + "&shared_secret=" + encodeURI(shared_secret);
    apiURL += "&tool_configuration[enabled]=true&config_type=by_url&config_url=" + encodeURI(config_url);
    console.log("API URL: " + apiURL + "\n");

    xhr.open("POST", apiURL);
    xhr.setRequestHeader("Authorization", "Bearer " + userToken);
    xhr.setRequestHeader("Cache-Control", "no-cache");

    xhr.send(data);
}

//Import Outcomes Function
function outcomesAPI(guid){
    var data = null;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
            alert("The outcomes are being imported. This may take 24/48hrs to show up in the client's instance.\n" + this.responseText);
        }
    });

    xhr.open("POST", "/api/v1/global/outcomes_import?guid=" + encodeURI(guid));
    xhr.setRequestHeader("Authorization", "Bearer " + userToken);
    xhr.setRequestHeader("Cache-Control", "no-cache");

    xhr.send(data);
}

function createUsers(newUserArray){
    updateConsoleLog('Start creating users');
    //updateConsoleLog(newUserArray);
    $.each(newUserArray, function(i,e) {
        updateConsoleLog('Processing user: ' + e.full_name + ' [' + e.user_id + ']');
        //API Call
        var data = null;

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        //What do do upon call competion
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                //if there is an error
                if(this.responseText.toLowerCase().indexOf('error') >=0 ){
                    updateConsoleLog("Failed to create user: " + e.full_name + ' [' + e.user_id + '] with error message\n' + this.responseText);
                }else{
                    //No errors (One hopes!)
                    updateConsoleLog("Completed user: " + e.full_name + ' [' + e.user_id + '] ');//& Canvas ID = ' + this.responseText.id);
                }
                console.log(this.responseText);
                return this.responseText;
            }/*else if(this.readyState === 404){
                updateConsoleLog("Error Message: " + this.responseText);
                console.log(this.responseText);
            }*/
        });
        //Build Post Call
        var postCall = "/api/v1/accounts/1/users?user[name]=" + encodeURIComponent(e.full_name);
        postCall += "&user[skip_registration]=true&pseudonym[send_confirmation]=false&pseudonym[unique_id]=" + encodeURIComponent(e.login_id);
        postCall += "&pseudonym[sis_user_id]=" + encodeURIComponent(e.user_id);
        if(e.auth_id != "") postCall += "&pseudonym[authentication_provider_id]=" + encodeURIComponent(e.auth_id);
        postCall += "&communication_channel[skip_confirmation]=true&communication_channel[type]=email&communication_channel[address]=" + encodeURIComponent(e.email);
        postCall += "&enable_sis_reactivation=true";

        xhr.open("POST", postCall);
        xhr.setRequestHeader("Authorization", "Bearer " + userToken);
        xhr.setRequestHeader("Cache-Control", "no-cache");

        xhr.send(data);
    });
}

function updateConsoleLog(newVal){
    $('#dg_console_log').val(timeStamp() + " | " + newVal + "\n" + $('#dg_console_log').val());
}

function timeStamp() {
    var now = new Date();
    var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];
    var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
    var suffix = ( time[0] < 12 ) ? "AM" : "PM";
    time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
    time[0] = time[0] || 12;
    for ( var i = 1; i < 3; i++ ) {
        if ( time[i] < 10 ) {
            time[i] = "0" + time[i];
        }
    }
    return date.join("/") + " " + time.join(":") + " " + suffix;
}

function createCanvasCourse(courseCode,courseID,accountID,longName,userID){
    updateConsoleLog("Begin create "+longName+" ["+courseID+"]...");
    var data = null;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
            //If ther user ID is null, then it's for create Canvas101
            if(this.responseText.toLowerCase().indexOf('error') >=0 ){
                updateConsoleLog("Failed to course create: " + longName + " [" + courseID +"] with error message\n" + this.responseText);
            }else{
                if(userID === null){
                    updateConsoleLog("Created Canvas101 with message: " + this.responseText);
                    //alert(this.responseText);
                    window.open("/courses/sis_course_id:canvas101/settings","_blank");
                    return this.responseText;
                }else{
                    //If user ID is not Null, then its for Enrollment
                    updateConsoleLog("Completed course create: " + longName + " [" + courseID +"]");
                    enrollUser(userID,courseID,"TeacherEnrollment");
                }
            }
        }
    });

    var buildPost = "/api/v1/accounts/sis_account_id:" + encodeURIComponent(accountID);
    buildPost +="/courses?course[name]=" + encodeURIComponent(longName);
    buildPost += "&course[course_code]=" + encodeURIComponent(courseCode);
    buildPost += "&course[sis_course_id]=" + encodeURIComponent(courseID);

    xhr.open("POST", buildPost);
    xhr.setRequestHeader("Authorization", "Bearer " + userToken);
    xhr.setRequestHeader("Cache-Control", "no-cache");

    xhr.send(data);
}

function createSandboxAccount(){
    // /api/v1/accounts/:account_id/sub_accounts
    updateConsoleLog('Begin create Sandbox account...');
    var data = null;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            if(this.responseText.toLowerCase().indexOf('error') >=0 ){
                updateConsoleLog("Failed to create Sandbox Account with message: " + this.responseText);
            }else {
                //console.log(this.responseText);
                updateConsoleLog("Completed Sandbox Account with message: " + this.responseText);
            }
            return this.responseText
        }
    });

    var buildPost = "/api/v1/accounts/1/sub_accounts?account[name]=" + encodeURIComponent('Sandbox');
    buildPost += "&account[sis_account_id]=" + encodeURIComponent('sandbox');

    xhr.open("POST", buildPost);
    xhr.setRequestHeader("Authorization", "Bearer " + userToken);
    xhr.setRequestHeader("Cache-Control", "no-cache");

    xhr.send(data);
}

function sandboxCreate(sandboxUserArray,canvas101){
    $.each(sandboxUserArray,function(user_index,user_element){
        if(canvas101 == "true"){
            enrollUser(user_element,"canvas101","StudentEnrollment");
        }

        var sandboxCourseCode = "My Sandbox";
        var sandboxCourseID=user_element+"_sandbox";
        var sandboxAccountID = "sandbox";
        var sandboxLongName = user_element + "'s Sandbox Course";

        createCanvasCourse(sandboxCourseCode,sandboxCourseID,sandboxAccountID,sandboxLongName,user_element);
    });
}

function enrollUser(user_id,course_id,role){
    updateConsoleLog('Begin enrolling user: ' + user_id + "; For course: " + course_id + "[" + role +"]");

    var data = null;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            //console.log(this.responseText);
            if(this.responseText.toLowerCase().indexOf('error') >=0 ){
                updateConsoleLog('Failed enrolling user: ' + user_id + "; For course: " + course_id + "[" + role +"] with message\n" + this.responseText);
            }else{
                updateConsoleLog('Completed enrolling user: ' + user_id + "; For course: " + course_id + "[" + role +"]");
            }
        }
    });

    var buildPost = "/api/v1/courses/sis_course_id:" + encodeURIComponent(course_id);
    buildPost += "/enrollments?enrollment[user_id]=sis_user_id:" + encodeURIComponent(user_id);
    buildPost += "&enrollment[type]=" + encodeURIComponent(role);
    buildPost += "&enrollment[enrollment_state]=active";

    xhr.open("POST", buildPost);
    xhr.setRequestHeader("Authorization", "Bearer " + userToken);
    xhr.setRequestHeader("Cache-Control", "no-cache");

    xhr.send(data);
}


