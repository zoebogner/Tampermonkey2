// ==UserScript==
// @name         Canvas betterments!
// @namespace    https://siteadmin.instructure.com/
// @version      2017.05.06.4
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

function update_sis_id(userArray) {
    //itterate through the array of canvas IDs
    $.each(userArray, function(index, element) {
        var settingsGET = {
            "async": true,
            "url": "/api/v1/users/sis_user_id:" + element.old + '/logins/',
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


            xhr.open("PUT", "/api/v1/accounts/1/logins/" + response[0].id + encodeURI("?login[sis_user_id]=") + element.new);
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

//global variables
var domain = 'https://' + document.location.hostname;
var userToken = getItem('token');

// If on an instructure page
if (document.location.hostname.indexOf('instructure.com') >= 0) {
    $(document).ready(function() {
        //add the settings link
        $('#menu > li:last').after('<li class="menu-item ic-app-header__menu-list-item" id="dg_li_settings"> <a id="dg_link_settings" href="' + domain + '/accounts/1/settings/configurations" class="ic-app-header__menu-list-link"> <div class="menu-item-icon-container" aria-hidden="true"> <div class="ic-avatar "> <img src="https://cdn3.iconfinder.com/data/icons/fez/512/FEZ-04-128.png" alt="Settings" title = "Settings"></div></div><div class="menu-item__text"> Settings </div></a></li>');

        //add the DG Tools link
        $('#menu > li:last').after('<li class="menu-item ic-app-header__menu-list-item" id="dg_li_self"> <a id="dg_link_self" href="/dgtools" class="ic-app-header__menu-list-link"> <div class="menu-item-icon-container" aria-hidden="true"> <div class="ic-avatar "> <img src="https://static1.squarespace.com/static/55751873e4b04dc410497087/t/5599db23e4b0af241ed85154/1436146468429/27ef868543abf9c4e16439c1aeb8f0bd.jpg?format=500w" alt="DG Tools" title = "DG Tools"> </div> </div> <div class="menu-item__text"> DG Tools </div></a></li>');

        //remove the images if on the old UI remove the images
        if ($('#menu > li:contains("Dashboard")').length <= 0) {
            $('#dg_li_self img, #dg_li_settings img').hide();
            $('#dg_link_self, #dg_link_settings').attr('class', 'menu-item-no-drop');
        }

        if (document.location.pathname === "/accounts/1/settings" || document.location.pathname === "/accounts/1/settings/configurations") { //if on the settings page
            //focus on the settings link
            $('li.ic-app-header__menu-list-item--active').attr('class', "menu-item ic-app-header__menu-list-item");
            $('li#dg_li_settings').attr('class', "menu-item ic-app-header__menu-list-item  ic-app-header__menu-list-item--active");

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
        if (document.location.pathname.indexOf("/accounts/1/users/") >= 0) {
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
                    var currentUserID = document.location.pathname.split("/accounts/1/users/").join('');
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
                    var postString = '/api/v1/accounts/1/logins?' + encodeURI('user[id]=' + currentUserID); //which users
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
        } else if (document.location.pathname.toLowerCase() === "/accounts/1/settings/configurations" || document.location.pathname.toLowerCase() === "/accounts/1/settings") {
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

            document.title = "Update User SIS id from one to another";
            $('#main').html('<div> <h1>Update User SIS id from one to another</h1> <div style="padding-left:50px;">Useful links; <ul> <li>Case convert: <a href="https://convertcase.net/" target="_blank">https://convertcase.net/</a> </li> <li>Convert Column to Comma Separated List: <a href="https://convert.town/column-to-comma-separated-list" target="_blank">https://convert.town/column-to-comma-separated-list</a> </li> </ul> <table> <tr> <th>Old SIS ID</th> <th>New SIS ID</th> <th>Console Log</th> </tr> <tr> <td> <textarea id="dg_old_sis_id" rows="20" cols="50"></textarea> </td> <td> <textarea id="dg_new_sis_id" rows="20" cols="50"></textarea> </td> <td> <textarea id="dg_console_log" rows="20" cols="150" disabled="disabled" style="width:100%;"></textarea> </td> </tr> <tr> <td> <label for="dg_apiToken">API token:</label> <br> <input id="dg_apiToken" type="text" name="dg_apiToken" value="' + userToken + '" autocomplete="off" cols="50" disabled="disabled"> </td> <td> <br> <button type="button" id="dg_updateGo">Update IDs</button> </td> </tr> </table> </div> </div>');

            $('button#dg_updateGo').click(function(e) {
                e.preventDefault();
                //disable fields and buttons
                $('button#dg_updateGo, #dg_old_sis_id, #dg_new_sis_id').attr('disabled', 'disabled');

                //get the arrays and confrim that they match
                var old_sis_ID = $('#dg_old_sis_id').val().split(',');
                var new_sis_ID = $('#dg_new_sis_id').val().split(',');

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
                    if (confirm("Are you sure?")) {
                        update_sis_id(newObjectArray);
                    } else {
                        return 0;
                    }
                } else {
                    return alert('Array lengths do not match!');
                }
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
                    "url": "/api/v1/accounts/1",
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
                    $('#help_tray > ul:first > li').before('<li class="ic-NavMenu-list-item"><a id="#dg_icSupportLink" href="' + linkURL + '" target="_blank" class="ic-NavMenu-list-item__link">IC Support</a><div class="ic-NavMenu-list-item__helper-text is-help-link">Link to the IC support page</div></li>');
                });
            }
            return;
        });


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