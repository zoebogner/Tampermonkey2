// ==UserScript==
// @name         Canvas Experience (CX) Tools
// @namespace    https://siteadmin.instructure.com/
// @namespace    https://instructure.my.salesforce.com/*
// @version      2023102601
// @description  Trying to take over the world! "Canvas Experience (CX) Tools"
// @author       Daniel Gilogley, Zoe Bogner and Christopher McAvaney
// @match        https://*.test.instructure.com/*
// @match        https://*.beta.instructure.com/*
// @match        https://*.instructure.com/*
// @match        https://*.security.instructure.com/*
// @match        https://s3.amazonaws.com/SSL_Assets/APAC/ticketpage.html*
// @match        https://instructure.my.salesforce.com/*
// @exclude      https://siteadmin*instructure.com/*
// @exclude      https://reports.instructure.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @run-at       document-idle
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @resource     customCSS https://raw.githubusercontent.com/clmcavaney/CX-Tools/master/canvasBetter.css
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instructure.com
// ==/UserScript==


if (typeof jQuery == 'undefined' || typeof jQuery === undefined || typeof jQuery === null) {
    var headTag = document.getElementsByTagName("head")[0];
    var jqTag = document.createElement('script');
    jqTag.type = 'text/javascript';
    jqTag.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js';
    headTag.appendChild(jqTag);
    jqTag.onload = myJQueryCode;
} else {
    myJQueryCode();
}

function myJQueryCode() {
    //global variables
    var domain = 'https://' + document.location.hostname;
    var userToken = getItem('token');
    var token = userToken;
    var _cx_tools_on = false;
    var _cx_tools_version = '2023102601';

    // If on an instructure page
    if (document.location.hostname.indexOf('instructure.com') >= 0) {
        $(document).ready(function() {
            var cssTxt = GM_getResourceText("customCSS");
            GM_addStyle(cssTxt);

            //add the settings link
            $('#menu > li:last').after('<li class="menu-item ic-app-header__menu-list-item" id="cx_li_settings"> <a id="cx_link_settings" href="' + domain + '/accounts/self/settings/configurations" class="ic-app-header__menu-list-link"> <div class="menu-item-icon-container" aria-hidden="true"> <div class="ic-avatar "> <img src="https://cdn3.iconfinder.com/data/icons/fez/512/FEZ-04-128.png" alt="CX Settings" title="Canvas Experience (CX) Settings"></div></div><div class="menu-item__text"> CX Settings </div></a></li>');

            //add the CX Tools link
            $('#menu > li:last').after('<li class="menu-item ic-app-header__menu-list-item" id="cx_li_self"> <a id="cx_link_self" href="/cxtools2" class="ic-app-header__menu-list-link"> <div class="menu-item-icon-container" aria-hidden="true"> <div class="ic-avatar "> <img src="https://raw.githubusercontent.com/clmcavaney/CX-Tools/master/assets/dabpanda.jpg" alt="CX Tools" title="Canvas Experience (CX) Tools"> </div> </div> <div class="menu-item__text"> CX Tools </div></a></li>');

            //remove the images if on the old UI remove the images
            if ($('#menu > li:contains("Dashboard")').length <= 0) {
                $('#cx_li_self img, #cx_li_settings img').hide();
                $('#cx_link_self, #cx_link_settings').attr('class', 'menu-item-no-drop');
            }

            // some regular expressions to match "users", "settings" and "permissions" pages
            const re_users=/accounts\/(\d+|self)\/users/;
            const re_settings=/\/accounts\/(\d+|self)\/settings/;
            const re_perms=/\/accounts\/[^\/]+\/permissions/;

            const sa_setting_hl_colour='#fdf3f3';


            // if on the settings page
            if ( document.location.pathname.toLowerCase().match(re_settings) !== null ) {
                _cx_tools_on = true;

                //focus on the settings link
                $('li.ic-app-header__menu-list-item--active').attr('class', "menu-item ic-app-header__menu-list-item");
                $('li#cx_li_settings').attr('class', "menu-item ic-app-header__menu-list-item  ic-app-header__menu-list-item--active");

                //Add a Salesforce link to the Account at the bottom of the page
                $('#account_external_integration_keys_salesforce_account_id').after('<a href="http://instructure.my.salesforce.com/' + $('#account_external_integration_keys_salesforce_account_id').val() + '" target="_blank" title="link to Salesforce Account ID"><img src="https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg" style="width: 5%; padding-left: 5px;">');

                //---------On the main Settings page of 'Settings-----------------
                //create the button to do the default settings
                $('#account_settings > legend').after('<button type="button" class="btn" id="cx_button_applyDefaults_settings"><img src="https://raw.githubusercontent.com/clmcavaney/CX-Tools/master/assets/dabpanda-cropped-16x16.png" /> Apply defaults</button>');
                //apply the action of clicking the default button
                $('#cx_button_applyDefaults_settings').click(function(e) {
                    e.preventDefault();
                    if (confirm("Are you sure?")) {
                        $('#cx_button_applyDefaults_settings').attr('disabled', 'disabled').css('cursor', 'default'); //Disable the button after click

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

                        //Add the show LTIs button on the settings page
                        //users must first be on the page before pressing the button
                        var settings_match = document.location.pathname.toLowerCase().match(re_settings);
                        if ( settings_match !== null ) {
                          $('nav#breadcrumbs').after('<div style="padding-left: 1rem;"><button type="button" id="cx_listLti_ID"><img src="https://raw.githubusercontent.com/clmcavaney/CX-Tools/master/assets/dabpanda-cropped-16x16.png" /> Show the LTI IDs</button></div>');
                          $("#cx_listLti_ID").click(function(e){
                            e.preventDefault();
                            $("#cx_listLti_ID").attr('disabled','disabled');
                            listLtiID(settings_match[1]);
                            return 0;
                          });
                        }

                    } else {
                        return 0;
                    }
                });
                //----------End do the apply default button -----------------------

                const admin_shield_svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0" y="0" width="24px" height="24px" style="padding-left: 0.25rem; vertical-align: middle;" viewBox="0 0 200 224" enable-background="new 0 0 200 224" xml:space="preserve"><path d="M87,83.47a9.53,9.53,0,1,1-9.53-9.53A9.53,9.53,0,0,1,87,83.47m35.26,62.28h17.29V128.45l-40-40,.44-4.19c.11-13.94-10.3-24.37-23.1-24.37a23.22,23.22,0,0,0,0,46.44l5.31-.6,7.18,7.17h16.86V126h13.14V142.9Zm30,12.71H117l-10.3-10.29v-9.43H93.57V125.59H84.16L77.58,119h-.65a35.93,35.93,0,1,1,35.92-35.92c0,.22,0,.43,0,.64l39.44,39.45ZM99.72,220.06a6.46,6.46,0,0,1-3-.78l-3.93-2.13c-34.84-18.92-82.55-44.81-82.55-99.89V49.59a6.37,6.37,0,0,1,3.65-5.76L97,4.66a6.28,6.28,0,0,1,5.4,0L185.6,43.83a6.37,6.37,0,0,1,3.65,5.76v67.67c0,55.08-47.72,81-82.55,99.89l-3.93,2.13A6.47,6.47,0,0,1,99.72,220.06ZM22.91,53.62v63.64c0,47.52,42.09,70.37,75.9,88.73l.9.48.91-.48c33.81-18.36,75.9-41.21,75.9-88.73V53.62L99.72,17.43Z"></path></svg>';

                // Adding identifiers to items that only SiteAdmin users can change
                $('#account_settings tr td > label[for=account_settings_mfa_settings]').parent().prepend(admin_shield_svg);
                $('#account_settings tr td > label[for=account_settings_mfa_settings]').parent().parent().css('border', '1px dashed red').css('background-color', sa_setting_hl_colour);
                $('#account_settings tr td > label[for=account_settings_mfa_settings]').parent().next().append('<div style="float: right;"><a href="https://instructure.atlassian.net/l/cp/Xc8GJziJ">setting definition</a></div>');

                $('#account_settings tr td > label[for=account_settings_include_students_in_global_survey]').append(admin_shield_svg).parent().css('background-color', sa_setting_hl_colour).append('<div style="float: right;"><a href="https://instructure.atlassian.net/l/cp/ynGUDHQ3">setting definition</a></div>');

                $('#account_settings > div > label[for=account_settings_increase_calendar_limit]').append(admin_shield_svg).parent().css('background-color', sa_setting_hl_colour).append('<div style="float: right;"><a href="https://instructure.atlassian.net/l/cp/t1xoN6TJ">setting definition</a></div>');

                $('#account_settings > fieldset.account_domains > legend:contains(Canvas Cloud Information)').css('align-items', 'center').css('display', 'flex').append(admin_shield_svg).css('background-color', sa_setting_hl_colour).next().append('<div style="float: right;"><a href="https://instructure.atlassian.net/l/cp/pmiRD7wo">setting definition</a></div>');
                $('#account_settings > fieldset.account_domains > legend:contains(Canvas Cloud Information)').next().append(admin_shield_svg).css('background-color', sa_setting_hl_colour);
                $('#account_settings > fieldset.account_domains > select').after(admin_shield_svg).css('background-color', sa_setting_hl_colour);
                $('#account_settings > fieldset.account_domains > ul li.new_domain button.add_domain_button').after(admin_shield_svg).parent().css('background-color', sa_setting_hl_colour);
                $('#account_settings > fieldset.account_domains > div').append(admin_shield_svg).css('background-color', sa_setting_hl_colour);

                $('#account_settings > fieldset > legend:contains(Acceptable Use Policy)').css('align-items', 'center').css('display', 'flex').append(admin_shield_svg).css('background-color', sa_setting_hl_colour).after('<div style="float: right;"><a href="https://instructure.atlassian.net/l/cp/1jA350b2">setting definition</a></div>');

// Canvas for Elementary is available to an account admin, removing this one
//                // Features - group the ones that are Site Admin specific
//                // comment for "Canvas for Elementary"
//                var _site_admin_div = $('#account_settings > fieldset > legend:contains(Features)').parent('fieldset').find('div').slice(1,3).wrapAll('<div style="border: 1px dashed red; padding: 0.5rem 0 0 0.5rem; margin-bottom: 1rem;"></div>').parent();
 //               _site_admin_div.prepend(admin_shield_svg).css('background-color', sa_setting_hl_colour).prepend('<div style="float: right;"><a href="/">setting definition</a></div>');
                $('#account_settings > fieldset > legend:contains(Features)').parent().find('div > label[for=account_settings_admins_can_change_passwords]').append(admin_shield_svg).parent().css('background-color', sa_setting_hl_colour).append('<div style="float: right;"><a href="https://instructure.atlassian.net/l/cp/dRycRojP">setting definition</a></div>');
                $('#account_settings > fieldset > legend:contains(Features)').parent().find('div > label[for=account_settings_admins_can_view_notifications]').append(admin_shield_svg).parent().css('background-color', sa_setting_hl_colour).append('<div style="float: right;"><a href="https://instructure.atlassian.net/l/cp/i5Z1RDRu">setting definition</a></div>');
                $('#account_settings > fieldset > legend:contains(Features)').parent().find('div > label[for=account_settings_enable_eportfolios]').append(admin_shield_svg).parent().css('background-color', sa_setting_hl_colour).append('<div style="float: right;"><a href="https://instructure.atlassian.net/l/cp/DVQSqzHM">setting definition</a></div>');
                $('#account_settings > fieldset > legend:contains(Features)').parent().find('div > label[for=account_allow_sis_import]').append(admin_shield_svg).parent().css('background-color', sa_setting_hl_colour).append('<div style="float: right;"><a href="https://instructure.atlassian.net/l/cp/tryFZ8mx">setting definition</a></div>');
                $('#account_settings > fieldset > legend:contains(Features)').parent().find('div > label[for=account_settings_include_integration_ids_in_gradebook_exports]').append(admin_shield_svg).parent().css('background-color', sa_setting_hl_colour).append('<div style="float: right;"><a href="https://instructure.atlassian.net/l/cp/5KRTXr2e">setting definition</a></div>');
                $('#account_settings > fieldset > legend:contains(Features)').parent().find('div > label[for=account_settings_allow_invitation_previews]').append(admin_shield_svg).parent().css('background-color', sa_setting_hl_colour).append('<div style="float: right;"><a href="https://instructure.atlassian.net/l/cp/7JLfs9XN">setting definition</a></div>');
                $('#account_settings > fieldset > legend:contains(Features)').parent().find('div > label[for=account_settings_enable_alerts]').append(admin_shield_svg).parent().css('background-color', sa_setting_hl_colour).append('<div style="float: right;"><a href="https://instructure.atlassian.net/l/cp/zE5KQ311">setting definition</a></div>');
                $('#account_settings > fieldset > legend:contains(Features)').parent().find('div > label[for=account_settings_global_includes]').append(admin_shield_svg).parent().css('background-color', sa_setting_hl_colour).prepend('<div style="float: right;"><a href="https://instructure.atlassian.net/l/cp/E9gmSBu7">setting definition</a></div>');
                $('#account_settings > fieldset > legend:contains(Features)').parent().find('div > label[for=account_settings_show_scheduler]').append(admin_shield_svg).parent().css('background-color', sa_setting_hl_colour).append('<div style="float: right;"><a href="https://instructure.atlassian.net/l/cp/U9DAmX1f">setting definition</a></div>');
                $('#account_settings > fieldset > legend:contains(Features)').parent().find('div > label[for=account_settings_enable_profiles]').append(admin_shield_svg).parent().css('background-color', sa_setting_hl_colour).append('<div style="float: right;"><a href="https://instructure.atlassian.net/l/cp/Umzv8NX0">setting definition</a></div>');
                $('#account_settings > fieldset > legend:contains(Features)').parent().find('div > label[for=account_settings_limit_parent_app_web_access]').append(admin_shield_svg).parent().css('background-color', sa_setting_hl_colour).append('<div style="float: right;"><a href="https://instructure.atlassian.net/l/cp/AgAj5S5d">setting definition</a></div>');
                $('#account_settings > fieldset > legend:contains(Features)').parent().find('div > label[for=account_settings_enable_turnitin]').append(admin_shield_svg).parent().css('background-color', sa_setting_hl_colour).append('<div style="float: right;"><a href="https://instructure.atlassian.net/l/cp/U0Qkmi00">setting definition</a></div>');
                $('#account_settings > fieldset > legend:contains(Features)').parent().find('div > label[for=account_services_account_survey_notifications]').append(admin_shield_svg).parent().css('background-color', sa_setting_hl_colour).append('<div style="float: right;"><a href="https://instructure.atlassian.net/l/cp/Kj0HXUgo">setting definition</a></div>');
                $('#account_settings > fieldset > legend:contains(Features)').parent().find('div > label[for=account_services_beta_for_students]').append(admin_shield_svg).parent().css('background-color', sa_setting_hl_colour).append('<div style="float: right;"><a href="https://instructure.atlassian.net/l/cp/L9qMTWxU">setting definition</a></div>');

                $('#account_settings > fieldset#add_sis_app_token > legend:contains(SIS Agent Token Authentication)').css('align-items', 'center').css('display', 'flex').append(admin_shield_svg).parent().css('background-color', sa_setting_hl_colour).prepend('<div style="float: right;"><a href="https://instructure.atlassian.net/l/cp/Hh9AEtzz">setting definition</a></div>');

                $('#account_settings > fieldset#external_integration_keys > legend:contains(External Integration Keys)').css('align-items', 'center').css('display', 'flex').append(admin_shield_svg).parent().css('background-color', sa_setting_hl_colour).prepend('<div style="float: right;"><a href="https://instructure.atlassian.net/l/cp/tPJFF3wG">setting definition</a></div>');

                $('nav ul#section-tabs > li > a:contains(Domain Lookups)').css('align-items', 'center').css('display', 'flex').append(admin_shield_svg).parent().css('background-color', sa_setting_hl_colour);
                $('nav ul#section-tabs > li > a:contains(SFTP User)').css('align-items', 'center').css('display', 'flex').append(admin_shield_svg).parent().css('background-color', sa_setting_hl_colour);


                // reference to the Canvas Feature Option Summary
                waitForKeyElements("#tab-features > div > span", append_feature_details);
                // 20231006 - can't get the correct trigger for this to work correctly
                // waitForKeyElements('#tab-features > div > table > tbody', append_feature_account_details);

                // END - adding SiteAdmin user shield



                // 20230824 - I think this code below no longer works - may remove it on a future release
                //Changes to the 'Apps' tab  - only if you click on my settings link, and did not navigate there natuarally
                $('#account_settings_tabs > ul > li:contains("Apps"):first > a:first').click(function(a) {
                    a.preventDefault();
                    setTimeout(function() {
                        $('#external_tools > div > div > div.Header > h2 > div > span.AddExternalToolButton > a.btn.btn-primary.add_tool_link.lm').click(function(b) {
                            b.preventDefault();
                            setTimeout(function() {
                                $('body > div.ReactModalPortal > div > div > div > div > div.ReactModal__Header-Title > h4').after('<button type="button" id="cx_button_canvasCommons">Canvas Commons</button>');
                                var name = "Commons Setup";
                                var consumerKey = "1";
                                var sharedSecret = "c9b6c488-4750-48ce-897c-b919ff3cb0f1";
                                var configURL = "https://lor.instructure.com/api/account-setup/tool-config";
                                $('#cx_button_canvasCommons').click(function(c) {
                                    c.preventDefault();
                                    $('#cx_button_canvasCommons').attr('disabled', 'disabled').css('cursor', 'default'); //Disable the button after click

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
            if ( document.location.pathname.toLowerCase().match(re_users) !== null ) {
                _cx_tools_on = true;

                //figure out how many logins there are and create a select list for them
                var optionCountHTML = '<option value="null">Select a login</option>';
                for (var i = 1; i <= $('fieldset#login_information > table.ic-Table > tbody > tr.login:not(:last)').length; i++) {
                    optionCountHTML += '<option value="' + i + '">' + i + '</option>';
                }
                optionCountHTML = '<span style="margin-right: 0.5rem;"><select class="locale" id="cx_changeAuthCount" style="width:initial;">' + optionCountHTML + '</select></span>';
                //Create the auth method select for Canvas, LDAP, SAML, Microsoft, and Google
                var changeAuthSelect = '<span style="margin-right: 0.5rem;"><select class="locale" name="cx_changeAuth" id="cx_changeAuth" style="width:initial;"><option value="null">Select an Auth method</option><option value="canvas">Canvas</option><option value="ldap">LDAP</option><option value="saml">SAML</option><option value="microsoft">Microsoft (Office 365)</option><option value="google">Google</option></select></span>';
                var deleteAndGoButton = '<span style="margin-right: 0.5rem;"><input type="checkbox" value="true" unchecked="true" name="cx_deleteOldAuthMethod" id="cx_deleteOldAuthMethod"> <label for="cx_deleteOldAuthMethod">Delete old Method</label></span><button id="cx_changeAuth_button" class="btn" style="bottom: 5px;">Go</button>';
                var td_details = changeAuthSelect + optionCountHTML + deleteAndGoButton;

                //Put in the option to the page for the auth method
                $('#name_and_email > table > tbody > tr:last').after('<tr id="cx_changeAuth_tr"><th><label for="cx_changeAuth"><img src="https://raw.githubusercontent.com/clmcavaney/CX-Tools/master/assets/dabpanda-cropped-16x16.png" /> Add login:</label></th></tr>');

                //put in the options dropdown
                $('#cx_changeAuth_tr').append('<td>' + td_details + '</td>');

                //When you click the 'Go' button
                $('#cx_changeAuth_button').click(function(e) {
                    e.preventDefault();
                    //disable the options
                    $('#cx_changeAuth_button,#cx_changeAuth,#cx_deleteOldAuthMethod,#cx_changeAuthCount').attr('disabled', 'disabled');
                    //replace the 'Go' button with the spinny wheel
                    $('#cx_changeAuth_button').html('<body id="cx_spin"><div class="loading_image_holder"><img src="/images/ajax-loader.gif" /></div>');
                    //check to see a proper value is selected
                    if ($('#cx_changeAuth').val() === "null" || $('#cx_changeAuthCount').val() === "null") {
                        alert('No Auth method or Number selected!');
                        return;
                    } else {
                        var currentUserID = ENV.USER_ID;
                        var authMethodSelected = $('#cx_changeAuth').val();
                        var authMethodNumber = $('#cx_changeAuthCount').val();
                        var authDeleteOld = $('#cx_deleteOldAuthMethod:checked').length;
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
            } else if ( document.location.pathname.toLowerCase().match(re_settings) !== null ) {
                _cx_tools_on = true;

                //token storage and update
                var tokenInputHTML = '<label for="cx_apiToken">API token:</label><div class="ic-Input-group"><input name="focus" type="hidden" value="' + userToken + '"><input id="cx_apiToken" type="text" name="cx_apiToken" class="ic-Input ui-autocomplete-input" value="' + userToken + '" aria-labelledby="course_name_label" autocomplete="off"><button class="Button" id="cx_apiTokenButton">Update</button></div><br>';
                $('#right-side').prepend(tokenInputHTML);
                $('#cx_apiTokenButton').click(function(e) {
                    e.preventDefault();
                    if (confirm("Update token with: " + $('#cx_apiToken').val())) {
                        storeItem('token', $('#cx_apiToken').val());
                        location.reload();
                    }
                    return;
                });
            } else if (document.location.pathname.toLowerCase() === "/cxtools1") {
                _cx_tools_on = true;

                //focus on the CX Tools links page
                $('li.ic-app-header__menu-list-item--active').attr('class', "menu-item ic-app-header__menu-list-item");
                $('li#cx_li_self').attr('class', "menu-item ic-app-header__menu-list-item  ic-app-header__menu-list-item--active");

                document.title = "CX Tools - Update User SIS id from one to another";
                $('#main').html('<div> <h1>Update User SIS id from one to another</h1> <div style="padding-left:50px;"> <table> <tr> <th>Old SIS ID / Canvas ID</th> <th>New SIS ID</th> <th>Console Log</th> </tr> <tr> <td> <textarea id="cx_old_sis_id" rows="20" cols="50"></textarea> </td> <td> <textarea id="cx_new_sis_id" rows="20" cols="50"></textarea> </td> <td> <textarea id="cx_console_log" rows="20" cols="150" disabled="disabled" style="width:100%;"></textarea> </td> </tr> <tr> <td> <label for="cx_apiToken">API token:</label> <br> <input id="cx_apiToken" type="text" name="cx_apiToken" value="' + userToken + '" autocomplete="off" cols="50" disabled="disabled"> </td> <td> <label for="cx_apiToken">SIS ID or Canvas ID:</label> <br> <select id="cx_canvasOrSIS" name="cx_canvasOrSIS"> <option value="sis_user_id:">SIS ID</option> <option value="">Canvas ID</option> </select> </td> <td> <br> <button type="button" id="cx_updateGo" class="btn filter_button">Update IDs</button> </td> </tr> </table> </div> <div style="padding-left:50px;" >Useful links; <ul> <li>Case convert: <a href="https://convertcase.net/" target="_blank">https://convertcase.net/</a> </li> <li>Convert Column to Comma Separated List: <a href="https://convert.town/column-to-comma-separated-list" target="_blank">https://convert.town/column-to-comma-separated-list</a> </li> </ul> </div> </div>');

                $('button#cx_updateGo').click(function(e) {
                    e.preventDefault();
                    //disable fields and buttons
                    $('button#cx_updateGo, #cx_old_sis_id, #cx_new_sis_id, #cx_canvasOrSIS').attr('disabled', 'disabled');

                    //get the arrays and confrim that they match
                    var old_sis_ID = csvOrNot($('#cx_old_sis_id').val());
                    var new_sis_ID = csvOrNot($('#cx_new_sis_id').val());

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
                            update_sis_id(newObjectArray, $('#cx_canvasOrSIS').val());
                        } else {
                            return 0;
                        }
                    } else {
                        return alert('Array lengths do not match!');
                    }
                });
            } else if(document.location.pathname.toLowerCase() === "/cxtools2") {
                _cx_tools_on = true;

                document.title = "CX Tools";
                const _main_menu_html_tpl = `
<div style="text-align: center;">
    <h1>Canvas Experience (CX) Tools</h1>
    <div>
        <em>CX Tools are the best!  Version: <a href="//github.com/clmcavaney/CX-Tools/releases/tag/_VERSION_" title="github tag reference">_VERSION_</a></em>
    </div>
</div>
<div style="padding-left:50px">
    <hr />
    <h2>Links</h2>
        <ul>
            <li><a href="/cxtools1">Update User SIS id from one to another</a></li>
            <li><a href="/cxtools3">Create Users</a></li>
            <li><a href="/cxtools4">Create Sandboxes</a></li>
            <li><a href="/cxtools5">Trust Account</a></li>
            <li><a href="https://instructure.atlassian.net/wiki/spaces/APACCS/pages/1314488774/SCORM+-+SCONE+Canvas+LTI" target="_blank">SCORM Setup</a></li>
            <li><a href="/catalog" target="_blank">Catalog Setup</a></li>
            <li><a href="/uuid.quiz.next" target="_blank">New Quizzes Setup</a></li>
            <li><a href="/accounts/self/settings/configurations#tab-tools" target="_blank">LTI Tool Config Settings Page</a></li>
            <li><a href="/api/v1/accounts/self?includes[]=lti_guid" target="_blank">Canvas Studio GUID</a></li>
            <li><a href="/plugins">Plugins for this instance</a></li>
            <li><a href="/error_reports">Error Reports for this instance</a></li>
        </ul>
    <h2>Tools</h2>
    <div id="cx_processing" style="display: none;"><img src="https://raw.githubusercontent.com/clmcavaney/CX-Tools/master/assets/processing-animation.gif" /></div>
        <ul>
            <li><strong>Generic</strong>
            <ul>
                <li class="cx_enable_inherited_lti"><button class="Button" type="button" id="cx_button_google_assignments" client_id="170000000000573">Google Assignments (LTI 1.3)</button></li>
            </ul>
            <li><strong>Sydney</strong>
                <ul>
                    <li class="cx_action_lti"><button class="Button" type="button" id="cx_button_syd_cc" key="1" secret="c9b6c488-4750-48ce-897c-b919ff3cb0f1" url="https://commons.sydney.canvaslms.com/api/account-setup/tool-config">Canvas Commons (SYD)</button></li>
                    <li class="cx_action_lti"><button class="Button" type="button" id="cx_button_syd_chat" key="5436" secret="AA7UiLCv5QQ63pQ7gWhIEZwiK0wE9bMUB35BT9JOi7zeW2GtIlJB7SkWttYirL1exa2NrN7Xkzu3O4dZlTRfJv9C" url="https://chat-syd.instructure.com/lti/configure.xml">Chat LTI (SYD)</button></li>
                    <li class="cx_action_lti"><button class="Button" type="button" id="cx_button_syd_rollCall" key="6edd0a5c8f95ff156168af6db62bf4fe4b404343bc3a7525e5a990d016c0a4c6" secret="49ba3d056fa0b4939aa1018dfeaf09211e922f1164d2c358daf624a9aed2fa2a" url="https://rollcall-syd.instructure.com/configure.xml">Roll Call - Attendance (SYD)</button></li>
                    <li class="cx_action_outcome"><button class="Button" type="button" id="cx_button_syd_outcomes" guid="A8326BEC-901A-11DF-A622-0C319DFF4B22">Australian Outcomes</button></li>
                    <li class="cx_action_externalTool"><button class="Button" type="button" id="cx_button_syd_office365" destination="https://office365-syd-prod.instructure.com" url="https://office365-syd-prod.instructure.com/config.xml">MS Office 365 LTI (SYD)</button></li>
                    <li class="cx_action_externalTool"><button class="Button" type="button" id="cx_button_syd_google" destination="https://google-drive-lti-syd-prod.instructure.com/lti_credentials/new" url="https://google-drive-lti-syd-prod.instructure.com/config">Google LTI (SYD)</button> (legacy - best to use the &quot;Google Assignments LTI 1.3&quot; - <a href="/accounts/1/developer_keys">inherited developer key</a>)</li>
                </ul>
            </li>
            <li><strong>Singapore</strong>
                <ul>
                    <li class="cx_action_lti"><button class="Button" type="button" id="cx_button_sg_cc" key="1" secret="c9b6c488-4750-48ce-897c-b919ff3cb0f1" url="https://commons.singapore.canvaslms.com/api/account-setup/tool-config">Canvas Commons (SG)</button></li>
                    <li class="cx_action_lti"><button class="Button" type="button" id="cx_button_sg_chat" key="5437" secret="21b2b6008685d7ced7319af8e1349d52b40808cef67e36a6068065c87c13309803adb82c5c880d8f7d928776" url="https://chat-sin.instructure.com/lti/configure.xml">Chat LTI (SG)</button></li>
                    <li class="cx_action_lti"><button class="Button" type="button" id="cx_button_sg_rollCall" key="6edd0a5c8f95ff156168af6db62bf4fe4b404343bc3a7525e5a990d016c0a4c6" secret="49ba3d056fa0b4939aa1018dfeaf09211e922f1164d2c358daf624a9aed2fa2a" url="https://rollcall-sin.instructure.com/configure.xml">Roll Call - Attendence (SG)</button></li>
                    <li class="cx_action_externalTool"><button class="Button" type="button" id="cx_button_sg_office365" destination="https://office365-sin-prod.instructure.com" url="https://office365-sin-prod.instructure.com/config.xml">MS Office 365 LTI (SG)</button></li>
                    <li class="cx_action_externalTool"><button class="Button" type="button" id="cx_button_sg_google" destination="https://google-drive-lti-sin-prod.instructure.com/lti_credentials/new" url="https://google-drive-lti-sin-prod.instructure.com/config">Google LTI (SG)</button> (legacy - best to use the &quot;Google Assignments LTI 1.3&quot; - <a href="/accounts/1/developer_keys">inherited developer key</a>)</li>
                </ul>
            </li>
            <li><strong>EUROPE (Dublin)</strong>
                <ul>
                    <li class="cx_action_lti"><button class="Button" type="button" id="cx_button_dub_chat" key="5298" secret="OB7UiLCv5QQ63pQ7gWhIEZwiK0wE9bMUB35BT9JOi7zeW2GtIlJB7SkPaaYirL1exa2NrN7Xkzu3O4dZlTRfJv9C" url="https://chat-eu.instructure.com/lti/configure.xml">Chat LTI (DUB)</button></li>
                    <li class="cx_action_lti"><button class="Button" type="button" id="cx_button_dub_rollCall" key="6edd0a5c8f95ff156168af6db62bf4fe4b404343bc3a7525e5a990d016c0a4c6" secret="49ba3d056fa0b4939aa1018dfeaf09211e922f1164d2c358daf624a9aed2fa2a" url="https://rollcall-eu.instructure.com/configure.xml">Roll Call - Attendance (DUB)</button></li>
                    <li class="cx_action_externalTool"><button class="Button" type="button" id="cx_button_dub_office365" destination="https://office365-dub-prod.instructure.com" url="https://office365-dub-prod.instructure.com/config.xml">MS Office 365 LTI (DUB)</button></li>
                    <li class="cx_action_externalTool"><button class="Button" type="button" id="cx_button_dub_google" destination="https://google-drive-lti-dub-prod.instructure.com/lti_credentials/new" url="https://google-drive-lti-dub-prod.instructure.com/config.xml">Google LTI (DUB)</button> (legacy - best to use the &quot;Google Assignments LTI 1.3&quot; - <a href="/accounts/1/developer_keys">inherited developer key</a>)</li>
                </ul>
            </li>
            <li><strong>EUROPE (Frankfurt)</strong>
                <ul>       
                    <li class="cx_action_lti"><button class="Button" type="button" id="cx_button_fra_cc" key="1" secret="c9b6c488-4750-48ce-897c-b919ff3cb0f1" url="https://commons.eu-central.canvaslms.com/api/account-setup/tool-config">Canvas Commons (FRA)</button></li>
                    <li class="cx_action_lti"><button class="Button" type="button" id="cx_button_fra_chat" key="5298" secret="OB7UiLCv5QQ63pQ7gWhIEZwiK0wE9bMUB35BT9JOi7zeW2GtIlJB7SkPaaYirL1exa2NrN7Xkzu3O4dZlTRfJv9C" url="https://chat-fra.instructure.com/lti/configure.xml">Chat LTI (FRA)</button></li>       
                    <li class="cx_action_lti"><button class="Button" type="button" id="cx_button_fra_rollCall" key="6edd0a5c8f95ff156168af6db62bf4fe4b404343bc3a7525e5a990d016c0a4c6" secret="49ba3d056fa0b4939aa1018dfeaf09211e922f1164d2c358daf624a9aed2fa2a" url="https://rollcall-eu.instructure.com/configure.xml">Roll Call - Attendance (FRA)</button></li>       
                    <li class="cx_action_externalTool"><button class="Button" type="button" id="cx_button_fra_office365" destination="https://office365-fra-prod.instructure.com" url="https://office365-fra-prod.instructure.com/config.xml">MS Office 365 LTI (FRA)</button></li>       
                   <li class="cx_action_externalTool"><button class="Button" type="button" id="cx_button_fra_google" destination="https://google-drive-lti-fra-prod.instructure.com/lti_credentials/new" url="https://google-drive-lti-fra-prod.instructure.com/config.xml">Google LTI (FRA)</button> (legacy - best to use the &quot;Google Assignments LTI 1.3&quot; - <a href="/accounts/1/developer_keys">inherited developer key</a>)</li>
                </ul>
            </li>
        </ul>
</div>
<hr />
<div style="padding-left:50px; padding-bottom: 2rem; width: 40%;">
    <label for="cx_apiToken">API token:</label>
    <div class="ic-Input-group">
        <input name="focus" type="hidden" value="_userToken_"><input id="cx_apiToken" type="text" name="cx_apiToken" class="ic-Input ui-autocomplete-input" value="_userToken_" aria-labelledby="course_name_label" autocomplete="off">
        <button class="Button" id="cx_apiTokenButton">Update API Token</button>
    </div>
</div>`.trim();

                var _main_menu_html = _main_menu_html_tpl.replaceAll("_VERSION_", _cx_tools_version).replaceAll('_userToken_', userToken);
                $('#main').html(_main_menu_html);

                // LTI Buttons Function
                $('li.cx_action_lti button').click(function(e){
                    e.preventDefault();
                    console.log("Installing this Tool: " + $(this).text());
                    console.log("Key: " + $(this).attr("key"));
                    console.log("Secret: " + $(this).attr("secret"));
                    console.log("URL: " + $(this).attr("url"));

                    //Disable the button
                    $(this).attr("disabled","disabled");

                    // show the user something is happening
                    $('#cx_processing').show();

                    //Call the function to install LTI based on the paramters in the HTML Buttons
                    installLTI($(this).text(), $(this).attr('key'), $(this).attr('secret'), $(this).attr('url'), "", $(this));
                });

                //Outcomes Install
                $('li.cx_action_outcome button').click(function(e){
                    e.preventDefault();
                    console.log('Installing outcomes: ' + $(this).text());
                    //Disable the button
                    $("button", this).attr("disabled","disabled");
                    outcomesAPI($('button',this).attr('guid'));
                });

                //External tool link (Office365 / GAFE)
                $('li.cx_action_externalTool button').click(function(e){
                    e.preventDefault();
                    $("button", this).attr("disabled","disabled");

                    window.open($('button',this).attr('destination') + "?canvasurl=" + document.location.hostname.split('.instructure.com').join(''), "_blank"); //Place to Generate tokens -
                    //window.open($('button',this).attr('url'), "_blank"); //Config XML - Not needed in 2.1
                    //window.open("/accounts/self/settings/configurations#tab-tools", "_blank"); //Config Page - Not needed in 2.1
                });

                // Inherited LTI developer key
                $('li.cx_enable_inherited_lti button').click(function(e){
                    e.preventDefault();

                    // disable the button
                    $(this).attr("disabled","disabled");

                    // show the user something is happening
                    $('#cx_processing').show();

                    // proposed function
                    enableLTIKeyandInstallLTI($(this).attr('client_id'), $(this));
                });

                //Update Token function
                $('#cx_apiTokenButton').click(function(e) {
                    e.preventDefault();
                    if (confirm("Update token with: " + $('#cx_apiToken').val())) {
                        storeItem('token', $('#cx_apiToken').val());
                        location.reload();
                    }
                    return;
                });
            }else if(document.location.pathname.toLowerCase() === "/cxtools3") {
                _cx_tools_on = true;

                //Create users page
                document.title="CX Tools - Create Users"
                $('#main').html('<div>    <h1>Create Users</h1>    <div style="padding-left: 50px;"><p>&quot;User ID&quot; and &quot;Login ID&quot; are the only required fields.</p><p>Multiple users can be specified and each users details can be comma separated or new line separated.</p></div><div style="padding-left:50px;">        <table>            <tr>                <th>First Name</th>                <th>Last Name</th>                <th>User ID</th>                <th>Login ID</th>                <th>Email Address</th>            </tr>            <tr>                <td>                    <textarea rows="10" id="cx_first_name" ></textarea>                </td>                <td>                    <textarea rows="10"id="cx_last_name"></textarea>                </td>                <td>                    <textarea id="cx_user_id" rows="10"></textarea>                </td>                <td>                    <textarea id="cx_login_id" rows="10"></textarea>                </td>                <td>                    <textarea id="cx_email" rows="10"></textarea>                </td>            </tr>            <tr>                <td>                    <label for="cx_apiToken">API token:</label>                    <br>                        <input id="cx_apiToken" type="text" name="cx_apiToken" value="' + userToken + '" autocomplete="off" cols="50" disabled="disabled">                        </td>                        <td>                            <label for="cx_apiToken">Auth Provider ID:</label>                            <br>                                <select class="locale" name="cx_set_auth" id="cx_set_auth" style="width:initial;">                                    <option value="">Null</option>                                    <option value="canvas">Canvas</option>                                    <option value="ldap">LDAP</option>                                    <option value="saml">SAML</option>                                    <option value="microsoft">Microsoft (Office 365)</option>                                    <option value="google">Google</option>                                    <option value="openid_connect">OpenID Connect</option>                                </select>                            </td>                            <td>                                <br>                                    <label>                                         <input id="cx_notifyUsers" type="checkbox" name="cx_notifyUsers" value="cx_notifyUsers">Notify?                                     </label>                                     <button type="button" id="cx_create_users" class="btn filter_button">Create Users</button>                                </td>                            </tr>                        </table>                        <div>                            <h3>Console Log</h3>                            <textarea id="cx_console_log" rows="10" cols="150" disabled="disabled" style="width:80%;"></textarea>                        </div>                    </div>                    <div style="padding-left:50px;" >      Useful links;                               <ul>                            <li>Case convert:                                 <a href="https://convertcase.net/" target="_blank">https://convertcase.net/</a>                            </li>                            <li>Convert Column to Comma Separated List:                                 <a href="https://convert.town/column-to-comma-separated-list" target="_blank">https://convert.town/column-to-comma-separated-list</a>                            </li>                        </ul>                    </div>                    <br>                        <br>                        </div>');

                //getting the auto created users from SF
                var urlVars = getUrlVars();
                if(urlVars.sfUsers == "true"){
                    var splitUsers = urlVars.userData.split('|');
                    $.each(splitUsers,function(){
                        var thisUser = this.split('~');
                        if(thisUser[0]!="undefined" && thisUser[0]!="" && thisUser[1]!="undefined" && thisUser[1]!="" && thisUser[2]!="undefined" && thisUser[2]!=""){
                            $('#cx_first_name').val($('#cx_first_name').val() + thisUser[0] + '\n');
                            $('#cx_last_name').val($('#cx_last_name').val() + thisUser[1] + '\n');
                            $('#cx_user_id').val($('#cx_user_id').val() + thisUser[2] + '\n');
                            $('#cx_login_id').val($('#cx_login_id').val() + thisUser[2] + '\n');
                            $('#cx_email').val($('#cx_email').val() + thisUser[2] + '\n');
                        }
                    });
                }

                $('button#cx_create_users').click(function(e) {
                    e.preventDefault();
                    //disable fields and buttons
                    $('#cx_create_users,#cx_set_auth,#cx_first_name,#cx_last_name,#cx_login_id,#cx_user_id,#cx_email,#cx_notifyUsers').attr('disabled', 'disabled');

                    //check the "Notify" flag
                    var notifyCheck = $('#cx_notifyUsers').prop('checked');
                    //if its not null or canvas, then u can't notify
                    if($('#cx_set_auth').val() == '' || $('#cx_set_auth').val() == 'canvas' || $('#cx_set_auth').val() == 'Null') notifyCheck = false;

                    //get the arrays and confrim that they match
                    var first_name = csvOrNot($('#cx_first_name').val());
                    var last_name = csvOrNot($('#cx_last_name').val());
                    var login_id = csvOrNot($('#cx_login_id').val());
                    var user_id = csvOrNot($('#cx_user_id').val());
                    var email = csvOrNot($('#cx_email').val());
                    var auth_id = $('#cx_set_auth').val();

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
                            createUsers(createNewUserArray,notifyCheck);
                        } else {
                            return 0;
                        }
                    } else {
                        return alert('Array lengths do not match!');
                    }
                });
            }else if(document.location.pathname.toLowerCase() === "/cxtools4") {
                _cx_tools_on = true;

                document.title="CX Tools - Create Sandboxes";
                const _create_sandboxes_html_tpl = `
<div>
	<h1>Create Sandboxes</h1>
	<div style="padding-left:50px;">
		<h3>Actions</h3>
		<table>
			<tr>
				<td>
					<ul>
						<li><button class="Button" type="button" id="cx_button_create_sandbox">Create &quot;Sandbox&quot; sub-account</button></li>
						<li><button class="Button" type="button" id="cx_button_create_canvas101">Create &quot;Canvas 101&quot; course in &quot;sandbox&quot; sub-account</button></li>
						<li>
							<div style="border: 1px solid #c7cdd1; border-radius: 4px; padding: 0.25rem;">
								<p style="margin-top: 0rem;">Create sandbox courses for each user below:</p>
								<p style="font-weight: bold;">User ID(s)</p>
								<textarea id="cx_user_id" rows="10"></textarea>
								<p>You can choose to enrol these users into the &quot;Canvas 101 (Growing with Canvas)&quot; course too.<br />
									<label for="cx_canvas101">Enrol user(s) in &quot;Canvas 101&quot;</label>
								<select class="locale" name="cx_canvas101" id="cx_canvas101" style="width:initial;">
									<option value="true">Yes</option>
									<option value="false">No</option>
								</select>
								</p>
								<button type="button" id="cx_create_sandboxes" class="btn filter_button">Create Sandboxes</button>
							</div>
						</li>
					</ul>
				</td>
			</tr>
		</table>

		<div><h3>API token</h3>
			<label for="cx_apiToken">Canvas access token:</label> <input id="cx_apiToken" type="text" name="cx_apiToken" value="_userToken_" autocomplete="off" cols="50" disabled="disabled" size="60" />
		</div>

		<div><h3>Console Log</h3>
			<textarea id="cx_console_log" rows="10" cols="150" disabled="disabled" style="width:80%;"></textarea>
		</div>

		<div>
			<h3>Useful links</h3>
			<ul>
				<li>Case convert: <a href="https://convertcase.net/" target="_blank">https://convertcase.net/</a> </li>
				<li>Convert Column to Comma Separated List: <a href="https://convert.town/column-to-comma-separated-list" target="_blank">https://convert.town/column-to-comma-separated-list</a> </li>
			</ul>
		</div>
	</div>
</div>
                `.trim();
                var _create_sandboxes_html = _create_sandboxes_html_tpl.replaceAll('_userToken_', userToken);
                $('#main').html(_create_sandboxes_html);

                //Create Sandbox Account
                $('#cx_button_create_sandbox').click(function(){
                    $('#cx_button_create_sandbox').attr('disabled','disabled');
                    var createSandbox = createSandboxAccount();
                });

                //Create canavs101 Button
                $('#cx_button_create_canvas101').click(function(){
                    $('#cx_button_create_canvas101').attr('disabled','disabled');
                    var createCanvas101 = createCanvasCourse("Canvas 101","canvas101","sandbox","Growing With Canvas",null);
                });

                //create Sandboxes function
                $('#cx_create_sandboxes').click(function(){
                    $('#cx_create_sandboxes, #cx_user_id, #cx_canvas101').attr('disabled','disabled');
                    var userID_array = csvOrNot($('#cx_user_id').val());
                    var alsoCanvas101 = $('#cx_canvas101').val();
                    sandboxCreate(userID_array,alsoCanvas101);
                });
            }else if(document.location.pathname.toLowerCase() === "/cxtools5") {
                _cx_tools_on = true;

                document.title="CX Tools - Create Trust";
                $('#main').html('<div>    <h1>Trust Account</h1>    <div style="padding-left:50px;">        <table>                        <tr>                <td>                    <label for="cx_apiToken">API token:</label>                    <br>                    <input id="cx_apiToken" type="text" name="cx_apiToken" value="' + userToken + '" autocomplete="off" cols="50" disabled="disabled"> </td>                <td>                    <label for="cx_apiToken">Trust users from this Account</label>                    <br>                    <label for="cx_trustID">Canvas Shard ID</label>                    <input type="text" id="cx_trustID" name="trustID"><br><br>                    <label for="cx_shard">Shard number (usually "1")</label>                    <input type="text" id="cx_shard" name="shard" value="1"><br><br>                </td>                <td>                    <br>                    <button type="button" id="cx_createTrust" class="btn filter_button">Create Trust</button>                </td><td><br><button type="button" id="cx_ListTrust" class="btn filter_button">List Trusted Canvas</button></td></tr>        </table>        <div>            <h3>Console Log</h3>            <textarea id="cx_console_log" rows="10" cols="150" disabled="disabled" style="width:80%;"></textarea>        </div>    </div>    <div style="padding-left:50px;"> Useful links;        <ul>            <li>Case convert: <a href="https://convertcase.net/" target="_blank">https://convertcase.net/</a> </li>            <li>Convert Column to Comma Separated List: <a href="https://convert.town/column-to-comma-separated-list" target="_blank">https://convert.town/column-to-comma-separated-list</a> </li>            <li>Internal Trust Doco: <a href="https://community.canvaslms.com/docs/DOC-5623" target="_blank">https://community.canvaslms.com/docs/DOC-5623</a>        </ul>    </div>    <br>    <br></div>');

                //When the user clicks "Create trust"
                $('#cx_createTrust').click(function(e){
                    e.preventDefault();
                    updateConsoleLog('Start creating trust...');
                    //disbaled the button and fields
                    $('#cx_createTrust, #cx_trustID, #cx_shard').attr('disabled','disabled');

                    //action the function to create the trust
                    var trustID = $('#cx_trustID').val();
                    var shardID = $('#cx_shard').val();
                    createTrust(trustID,shardID);

                    return 0;
                });

                //List trusts attached to the Canvas
                $('#cx_ListTrust').click(function(e){
                    e.preventDefault();
                    updateConsoleLog('Checking trusts...');
                    $('#cx_ListTrust').attr('disabled','disabled');
                    listTrusts();
                });
            }

            //link to the IC support page within the Canvas help
            $($('#global_nav_help_link').parent()).click(function() {
                //check to see if the link has been made, as the canvas help only renders on the help link click!
                if ($('#cx_icSupportLink').length === 0) {

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
                            cxtools: true,
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
                        $('#help_tray > ul:first > li:first').before('<li class="ic-NavMenu-list-item"><a id="#cx_icSupportLink" href="' + linkURL + '" target="_blank" class="ic-NavMenu-list-item__link">IC Support</a><div class="ic-NavMenu-list-item__helper-text is-help-link">Link to the IC support page</div></li>');
                    });
                }
                return;
            });

            //if within a course
            if(document.location.pathname.toLowerCase().indexOf('/courses/') >= 0){

                // Add button to take user back to courses list for root account
                $('div.ic-app-nav-toggle-and-crumbs > div.right-of-crumbs').append('<a class="btn" rel="nofollow" href="/accounts/1"><img src="https://raw.githubusercontent.com/clmcavaney/CX-Tools/master/assets/dabpanda-cropped-16x16.png" /> View all courses</a>');


                if(document.location.pathname.toLowerCase() === "/courses/" + ENV.course_id){
                    _cx_tools_on = true;

                    //If on the homepage of the course

                    //Settings link above the options on RHS
                    $('#course_show_secondary > div.course-options > a.btn.button-sidebar-wide.course-home-sub-navigation-lti:last').before('<a href="/courses/' + ENV.course_id + '/settings" class="btn button-sidebar-wide course-home-sub-navigation-lti"><img src="https://raw.githubusercontent.com/clmcavaney/CX-Tools/master/assets/dabpanda-cropped-16x16.png" /> <i class="icon-link"></i> Course Settings</a>');
                    //Undelete option
                    $('#course_show_secondary > div.course-options > a.btn.button-sidebar-wide.course-home-sub-navigation-lti:last').before('<a href="/courses/' + ENV.course_id + '/undelete" class="btn button-sidebar-wide course-home-sub-navigation-lti"><img src="https://raw.githubusercontent.com/clmcavaney/CX-Tools/master/assets/dabpanda-cropped-16x16.png" /> <i class="icon-link"></i> Undelete Course Content</a>');
                }
            }

            if ( document.location.pathname.match(re_perms) !== null ) {
                _cx_tools_on = true;

                // change each header to be no longer than 18 characters followed by an ellipses - but only call the function once the table has been loaded
                waitForKeyElements("table.ic-permissions__table", fix_permission_header);
            }

            // Turn on ribbon if a page has modification through the CX Tools
            if (_cx_tools_on == true) {
                // put the banner div after the body
                $('body').prepend('<div class="cx-tools-ribbon"><img src="https://raw.githubusercontent.com/clmcavaney/CX-Tools/master/assets/dabpanda-cropped-16x16.png" /> CX Tools ON</div>');
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

                //if done via CX Tools
                if (icSupportObject.cxtools == "true") {
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
    }else if(window.location.hostname === "instructure.my.salesforce.com"){
        //If in Salesforce, load some of the salesforce stuff
        if($('div.pbBody table:contains("Contact Status")').length > 0 || $('h2.mainTitle').text() === "Account Detail"){
            buildTheContactsTableUI();
            if($('h2.mainTitle').text() === "Account Detail"){
                setTimeout(
                    function() {
                        console.log('here');
                        buildTheContactsTableUI();
                    }, 5000
                );
            }
        }else if(document.location.pathname.toLowerCase() === "/cxtools3") {
            //Once on the create users page
            var urlVars = getUrlVars();
            if(urlVars.sfUsers == "true"){
                var splitUsers = urlVars.userData.split('|');
                $.each(splitUsers,function(){
                    var thisUser = this.split('~');
                    if(thisUser[0]!="undefined" && thisUser[0]!="" && thisUser[1]!="undefined" && thisUser[1]!="" && thisUser[2]!="undefined" && thisUser[2]!=""){
                        $('#cx_first_name').val($('#cx_first_name').val() + thisUser[0] + '\n');
                        $('#cx_last_name').val($('#cx_last_name').val() + thisUser[1] + '\n');
                        $('#cx_user_id').val($('#cx_user_id').val() + thisUser[2] + '\n');
                        $('#cx_login_id').val($('#cx_login_id').val() + thisUser[2] + '\n');
                        $('#cx_email').val($('#cx_email').val() + thisUser[2] + '\n');
                    }
                });
            }
        }
    }

    // ============== My functions =====================

    //get all the LTIs installed
    function listLtiID(canvas_account_id){
      var form = new FormData();
      var settings = {
        "url": "/api/v1/accounts/" + canvas_account_id + "/external_tools?per_page=100",
        "method": "GET",
        "timeout": 0,
        "headers": {
          "Authorization": "Bearer " + userToken
        },
        "processData": false,
        "mimeType": "multipart/form-data",
        "contentType": false,
        "data": form
      };

      $.ajax(settings).done(function (response) {
        console.log(response);
        apiReply = JSON.parse(response);
        if(apiReply.length > 0){
          $.each(apiReply,function(index,element){
            console.log(element);
            $("td.external_tool.e-tool-table-data[title='"+ element.name + "']").append(' - LTI ID #' + element.id);
          });

          //add the hide button too
          var buildHideButton = '<form id="cx_hideLTI" autocomplete="off"><label for="lti_id" style="display: initial;">LTI ID:</label><input autocomplete="off" type="text" id="lti_id" name="lti_id"><label for="lti_name" style="display: initial;"> New Name:</label><input autocomplete="off" type="text" id="lti_name" name="lti_name"> <button type="button" id="cx_hideLTI_submit">Hide this LTI!</button>';

          $('div.Header > div > p:last').after(buildHideButton);

          $("#cx_hideLTI_submit").click(function(e){
            e.preventDefault();
            $("#cx_hideLTI_submit").attr('disabled','disabled');
            if(confirm("Are you sure you want to do this?! It cannot be undone!") === true) hideElement();
          });
        }
      });
    }


    //function to hide and rename an LTI based on the LTI's ID within the Canvas
    function hideElement(){
      var data = new FormData();

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
          console.log(this.responseText);
          //refresh the page after success
          location.replace("/accounts/self/settings/configurations#tab-tools");
          window.location.href = window.location.origin + "/accounts/self/settings/configurations#tab-tools";
        }
      });

      var xhrBuild = "/api/v1/accounts/1/external_tools/" + $('input#lti_id').val();
      xhrBuild += "?course_navigation%5Benabled%5D=false&account_navigation%5Benabled%5D=false&user_navigation%5Benabled%5D=false&course_home_sub_navigation%5Benabled%5D=false&editor_button%5Benabled%5D=false&homework_submission%5Benabled%5D=false&link_selection%5Benabled%5D=false&migration_selection%5Benabled%5D=false&tool_configuration%5Benabled%5D=false&resource_selection%5Benabled%5D=false&global_navigation=false&assignment_selection=false&collaboration=false"

      if($('input#lti_id').val() !== null){
        xhrBuild+= "&name=";
        xhrBuild+= encodeURI($('input#lti_name').val());
      }

      xhr.open("PUT", xhrBuild);
      xhr.setRequestHeader("Authorization", "Bearer " + userToken);

      xhr.send(data);
    }

    //Add the show LTIs button on the settings page
    //users must first be on the page before pressing the button
    const re_settings=/\/accounts\/(\d+|self)\/settings/;
    var settings_match = document.location.pathname.toLowerCase().match(re_settings);
    if ( settings_match !== null ) {
      $('nav#breadcrumbs').after('<div style="padding-left: 1rem;"><button type="button" id="cx_listLti_ID"><img src="https://raw.githubusercontent.com/clmcavaney/CX-Tools/master/assets/dabpanda-cropped-16x16.png" /> Show the LTI IDs</button></div>');
      $("#cx_listLti_ID").click(function(e){
        e.preventDefault();
        $("#cx_listLti_ID").attr('disabled','disabled');
        listLtiID(settings_match[1]);
        return 0;
      });
    }

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
                        $('#cx_console_log').val("Error: " + jqXHR.status + " - User not found: " + element.old + " \n" + $('#cx_console_log').val());
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
                        $('#cx_console_log').val("Completed id update for: " + element.new + " [" + element.old + "]\n" + $('#cx_console_log').val());
                    }
                });


                xhr.open("PUT", "/api/v1/accounts/self/logins/" + response[0].id + encodeURI("?login[sis_user_id]=") + element.new);
                xhr.setRequestHeader("authorization", "Bearer " + userToken);
                xhr.setRequestHeader("cache-control", "no-cache");
                xhr.send(data);
                console.log("Processing for: " + element.new + "[" + element.old + "]");
                $('#cx_console_log').val("Processing for: " + element.new + "[" + element.old + "]\n" + $('#cx_console_log').val());
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

    // Install LTIs that use URL Install
    function installLTI(name, consumer_key, shared_secret, config_url, canvas_lti_url, button_trigger) {
        var data = null;

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        if(canvas_lti_url === null || canvas_lti_url === undefined){
            canvas_lti_url = "";
        }

        //Build the API Call
        var apiURL = canvas_lti_url + "/api/v1/accounts/self/external_tools?name=";
        apiURL += encodeURI(name) + "&privacy_level=public&consumer_key=";
        apiURL += encodeURI(consumer_key) + "&shared_secret=" + encodeURI(shared_secret);
        apiURL += "&tool_configuration[enabled]=true&config_type=by_url&config_url=" + encodeURI(config_url);
        console.log("API URL: " + apiURL + "\n");

        xhr.open("POST", apiURL);
        xhr.setRequestHeader("Authorization", "Bearer " + userToken);
        xhr.setRequestHeader("Cache-Control", "no-cache");

        xhr.send(data);

        xhr.onload = function() {
            if ( xhr.status != 200 ) {
                alert(`${xhr.status}: ${xhr.statusText}`);
            }
            $(button_trigger).removeAttr("disabled");
            $('#cx_processing').hide();

            // LTI specific code can go here if required

            // If the LTI is Canvas Commons, there is one more step so present the link to head on over and complete that step
            if ( name.match('Canvas Commons') != null ) {
                $(button_trigger).parent().append(' LTI installed. Now <a href="/accounts/self/settings/configurations#tab-tools">complete configuration via root account settings/apps area</a>');
            }
        };
    }

    // enable an inherited LTI developer key
    function enableLTIKeyandInstallLTI(client_id, button_trigger) {
        // relative to the domain of the Canvas instance being browsed
        var apiURL = '/api/v1/accounts/self/developer_keys/' + client_id + '/developer_key_account_bindings';
        // JSON body
        var payload = JSON.stringify({developer_key_account_binding:{workflow_state:'on'}});

        // debugging
        // alert('enableLTIKey(): apiURL == ' + apiURL);
        // alert('enableLTIKey(): payload == ' + payload);

        $.ajax({
            type: "POST",
            url: apiURL,
            headers: {
                "Authorization": "Bearer " + userToken,
                "Cache-Control": "no-cache",
            },
            data: payload,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(response) {
                console.log('successfully enabled developer LTI key: ' + client_id);
                parsed_response = $.parseJSON(JSON.stringify(response));
                console.log('developer LTI key: ' + parsed_response.workflow_state);
                // debugging
                // alert('at this point make a HTTP POST request to install the app/LTI');
                installLTIviaClientID(client_id, button_trigger);
            },
            error: function(e) {
                console.log(e);
                console.log(JSON.parse(e.responseText));
                json_msg = $.parseJSON(e.responseText);
                var err_msg = json_msg['errors']['base'];
                console.log('Unable to enable developer LTI key: ' + err_msg);
            }
        });
    }

    // install LTI via client_id
    function installLTIviaClientID(client_id, button_trigger) {
        // relative to the domain of the Canvas instance being browsed
        var apiURL = '/api/v1/accounts/1/external_tools/';

        // debugging
        // alert('installLTIviaClientID(): client_id == ' + client_id);

        $.ajax({
            type: "POST",
            url: apiURL + '?' + $.param({client_id: client_id}),
            headers: {
                "Authorization": "Bearer " + userToken,
                "Cache-Control": "no-cache",
            },
            success: function(response) {
                console.log('successfully installed external tool (aka LTI)');
                parsed_response = $.parseJSON(JSON.stringify(response));
                console.log('name of installed LTI: ' + parsed_response.name);

                $(button_trigger).removeAttr("disabled");
                $('#cx_processing').hide();

                $(button_trigger).parent().append(' LTI installed');
            },
            error: function(e) {
                console.log(e);
                console.log(JSON.parse(e.responseText));
                json_msg = $.parseJSON(e.responseText);
                var err_msg = json_msg['errors']['base'];
                console.log('Unable to install external tool: ' + err_msg);
            }
        });
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

    function createUsers(newUserArray, notifyCheck){
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
            var postCall = "/api/v1/accounts/self/users?user[name]=" + encodeURIComponent(e.full_name);
            postCall += "&user[skip_registration]="+!notifyCheck;
            postCall += "&pseudonym[send_confirmation]="+notifyCheck;
            //postCall += "&pseudonym[force_self_registration]=" + notifyCheck;
            postCall += "&pseudonym[unique_id]=" + encodeURIComponent(e.login_id);
            postCall += "&pseudonym[sis_user_id]=" + encodeURIComponent(e.user_id);
            if(e.auth_id != "") postCall += "&pseudonym[authentication_provider_id]=" + encodeURIComponent(e.auth_id);
            if(!notifyCheck)postCall += "&communication_channel[skip_confirmation]=true";
            postCall += "&communication_channel[type]=email&communication_channel[address]=" + encodeURIComponent(e.email);
            postCall += "&enable_sis_reactivation=true";

            console.log("Create user PostCall: " + postCall);

            xhr.open("POST", postCall);
            xhr.setRequestHeader("Authorization", "Bearer " + userToken);
            xhr.setRequestHeader("Cache-Control", "no-cache");

            xhr.send(data);
        });
    }

    function updateConsoleLog(newVal){
        $('#cx_console_log').val(timeStamp() + " | " + newVal + "\n" + $('#cx_console_log').val());
    }

    function timeStamp() {
        var now = new Date();
        var currentMonth = now.getMonth() + 1;
        if (currentMonth < 10) currentMonth = "0" + currentMonth;
        var date = [ now.getDate(), currentMonth, now.getFullYear() ];
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
            var sandboxCourseID = user_element+"_sandbox";
            var sandboxAccountID = "sandbox";
            var userDisplayName = getUsersFullName(user_element);
            //console.log('Display name: ' + userDisplayName);
            var sandboxLongName = userDisplayName + "'s Sandbox Course";
            //console.log('Course long name: ' + sandboxLongName);

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


    //Create trust function
    function createTrust(targetID,shardID){
        //build Post URL
        //Example post: "https://apaccs.instructure.com/api/v1/accounts/13677~1/trust_links?trust_link%5Bmanaging_account_id%5D=16292~1"

        var buildPost = "/api/v1/accounts/";
        //add this accounts ID
        buildPost += ENV.DOMAIN_ROOT_ACCOUNT_ID;
        buildPost += "/trust_links";

        $.ajaxSetup({
            headers:{
                "Authorization": "Bearer " + userToken,
                "Cache-Control": "no-cache",
            }
        });

        var trust_data = 'trust_link[managing_account_id]=' + targetID + "~" + shardID;
        console.log(trust_data);
        $.ajax({
            url: buildPost,
            type: 'POST',
            data: trust_data,
            success: function(response) {
                console.log("success");
                console.log(response);
                updateConsoleLog('Success! Created Trust - ID:' + response['id']);
            },
            error: function(e) {
                console.log(e);
                console.log(JSON.parse(e.responseText));
                json_msg = jQuery.parseJSON(e.responseText);
                var err_attr = json_msg['errors']['managed_role_id'][0]['attribute'];
                var err_msg = json_msg['errors']['managed_role_id'][0]['message'];
                updateConsoleLog('Unable to create trust: ' + err_attr + ' - ' + err_msg);
            },
            dataType: "json"
        });
    }

    function listTrusts(){
        var buildPost = "/api/v1/accounts/";
        buildPost += ENV.DOMAIN_ROOT_ACCOUNT_ID;
        buildPost += '/trust_links';

        $.ajaxSetup({
            headers:{
                "Authorization": "Bearer " + userToken,
                "Cache-Control": "no-cache",
                "Accept": "application/json+canvas-string-ids"
            }
        });

        $.get( buildPost, function( data ) {
            console.log("success");

            updateConsoleLog('API call success! Now listing IDs of trusted Canvi: (above - can take a little while)');

            console.log("length of data is " + data.length);

            if ( data.length == 0 ) {
                updateConsoleLog('No trusts found')
            } else {
                // Get details (i.e. name of each trusted instance)
                // "/api/v1/accounts/<account id>";
                // console.log(json_resp);
                $.each(data, function( key, value ) {
                    // console.log(value);
                    $.get( "/api/v1/accounts/" + value.managing_account_id, function( data ) {
                        console.log("success");
                        updateConsoleLog(JSON.stringify(value));
                        updateConsoleLog('ID: ' + value.id + ' Name: ' + data.name);
                    }, 'json')
                        .fail(function() {
                            console.log("error");
                            updateConsoleLog('Unable to get account name for "' + value.managing_account_id + '"');
                        });
                });
            }
        }, 'json')
            .fail(function() {
                console.log("error");
                updateConsoleLog('Unable to get trusts: ' + data);
            });
    }

    function getUsersFullName(sisUserId){
        var returnName;

        // ===== AJAX ===
        var settings = {
            url: "/api/v1/users/sis_user_id:" + encodeURI(sisUserId),
            method: "GET",
            timeout: 0,
            async: false,
            cache: false,
            headers: {
                Authorization: "Bearer " + userToken
            }
        };

        $.ajax(settings).done(function (response) {
            returnName = response.name;
            //updateConsoleLog('Users name:' + returnName);
        });

        return returnName;
    }


    //======== Begin Google / Office LTI Auto Install ========

    //read the ? part and add to action form for URL
    //https://office365-syd-prod.instructure.com/lti_credentials/new
    //
    if(document.location.pathname === "/lti_credentials/new" || document.location.hostname.indexOf("office365")>=0){
        $(document).ready(function(){
            var getCanvasURL = getUrlVars(); // Get the Canvas URL from the paramters
            //Inster the Canvas as a paramter of the action to display on the next page with the key/secret information
            $('form').attr('action',$('form').attr('action') + "?canvasurl=" + getCanvasURL.canvasurl);
        });
    }

    //create the function for the Office 365 and or Google LTI to auto install
    if(document.location.pathname === "/lti_credentials"){
        var headTag = document.getElementsByTagName("head")[0];
        var jqTag = document.createElement('script');
        jqTag.type = 'text/javascript';
        jqTag.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js';
        headTag.appendChild(jqTag);
        jqTag.onload = myJQueryCode;

        $(document).ready(function(){
            var getCanvasURL = getUrlVars(); //Get the Canvas URL from the paramaters that have been passed above
            var canvasDestinationUrl = "";
            //check to see if there are paramters, else set the value to null
            if(getCanvasURL.canvasurl === undefined || getCanvasURL.canvasurl === null){
                canvasDestinationUrl = "";
            }else{
                canvasDestinationUrl = getCanvasURL.canvasurl;
            }

            //pull the key / secret / XML from the webpage
            var ltiKey = $('#lti-key').text();
            var ltiSecret = $('#lti-secret').text();
            var ltiXML = $('#lti-config').text();

            //Get the display name of the LTI
            var ltiName = $('div.text-center.bold:first').text();
            ltiName = ltiName.split('Your Key for ').join('');
            ltiName = ltiName.split(' is').join('');
            ltiName = ltiName.trim();

            //console debug
            console.log("Name = " + ltiName);
            console.log("Key = " + ltiKey);
            console.log("Secret = " + ltiSecret);
            console.log("XML = " + ltiXML);

            // Add the button at the bottom of the page
            $('body').append('<div><center>https://<input id="sendToCanvas_url" type="text" name="sendToCanvas" value="' + canvasDestinationUrl + '" autocomplete="off">.instructure.com/ <button class="Button" id="sendToCanvas_button">Send ' + ltiName + ' To Canvas</button><br><br>API Token = ' + userToken + '...</center></div>');

            //Create the event tigger when the user clicks the Send LTI to Canvas Button
            $('#sendToCanvas_button').click(function(e){
                //Prevent default action
                e.preventDefault();
                //disable button and input field
                $('#sendToCanvas_button,#sendToCanvas_url').attr('disabled',true);
                $('#sendToCanvas_button,#sendToCanvas_url').attr('style','cursor: not-allowed;pointer-events: none;opacity: 0.5;');

                //Calculate the destination URL
                var ltiDestination = $('#sendToCanvas_url').val();
                if(ltiDestination === null || ltiDestination === undefined){
                    //If destiantion is not there - Tell user and exit function
                    alert("No URL found!\nRefresh the page and try again...");
                    return;
                }else{
                    //If the URL is there, continue to calculate the URL
                    ltiDestination = "https://" + ltiDestination + ".instructure.com";
                    console.log('Canvas Destination: ' + ltiDestination)

                    //build the paramters URL
                    ltiDestination += "/accounts/self/settings/configurations#tab-tools?cx_installLTI=true";
                    ltiDestination += "&ltiName=" + encodeURI(ltiName);
                    ltiDestination += "&ltiKey=" + encodeURI(ltiKey);
                    ltiDestination += "&ltiSecret=" + encodeURI(ltiSecret);
                    ltiDestination += "&ltiXML=" + encodeURI(ltiXML);

                    console.log('Canvas URL for LTI creation: '+ ltiDestination)

                    //Head to the LTI install page to complete the installation
                    var win = window.open(ltiDestination, '_blank');
                }
            });
        });
    }

    //now on the LTI config Settings
    if(document.location.pathname === "/accounts/self/settings/configurations"){
        var ltiURLvals = getUrlVars();
        if(ltiURLvals.cx_installLTI === undefined || ltiURLvals.cx_installLTI === null){
            console.log('No LTI to install');
        }else{
            alert("Installing LTI: " + ltiURLvals.ltiName + "\nClick 'OK' and the page will refresh with the LTI Installed");

            //console log the LTI Values
            console.log("Name = " + ltiURLvals.ltiName);
            console.log("Key = " + ltiURLvals.ltiKey);
            console.log("Secret = " + ltiURLvals.ltiSecret);
            console.log("XML = " + ltiURLvals.ltiXML);

            //Call the Install LTI function
            installLTI(ltiURLvals.ltiName,ltiURLvals.ltiKey,ltiURLvals.ltiSecret,ltiURLvals.ltiXML);
            location.replace("https://" + window.location.hostname + "/accounts/self/settings/configurations#tab-tools");
        }

    }

    //======== End Google / Office LTI Auto Install ========

    var headTag = document.getElementsByTagName("head")[0];
    var jqTag = document.createElement('script');
    jqTag.type = 'text/javascript';
    jqTag.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js';
    headTag.appendChild(jqTag);
    jqTag.onload = myJQueryCode;
}


function openInNewTab(url) {
    var win = window.open(url, '_blank');
    win.focus();
}

function getUsers(){
    var contactTable = $('div.pbBody table:contains("Contact Status") tr:not(:first):has(:checkbox:checked)');
    var contactArray = [];
    var userArrayString ="";

    for(var i=0; i < contactTable.length; i++){

        var firstName;
        var lastName;
        var email;
        var checkEmail;


        checkEmail = $('td:eq(2)',contactTable[i]).text();
        email = checkEmail.toString();
        checkEmail = email.split('[Gmail]').join('');
        email = checkEmail.trim();

        if(email != ""){

            var name = $('th',contactTable[i]).text();

            //if the name doesnt have a "," to seperate the names
            if(name.indexOf(',')<0){
                firstName = name;
                lastName = name;
            }else {
                var splitName = name.toString().split(', ');

                lastName = splitName[0];
                lastName = lastName.trim();

                firstName = splitName[1];
                firstName = firstName.trim();
            }
            var jsonPush = {"firstName":firstName, "lastName":lastName, "email":email}

            userArrayString = userArrayString + firstName + "~" + lastName + "~" + email + "|";

            //contactArray.push(jsonPush);
        }//*/
    }
    //console.log(userArrayString);
    return userArrayString;
}

function buildTheContactsTableUI(){
    //Put the action box at the top
    if($('h2.mainTitle').text() === "Account Detail"){
        $('div.listRelatedObject.contactBlock input[value="New Contact"]').after('<input type="text"  id="cx_canvasURL"></input><input type="button" class="btn" Value = "Send Users to Canvas.instructure.com" id="cx_userToCanvas"></input>');
    }else{
        $('div.pbHeader:first').after('<input type="text"  id="cx_canvasURL"></input><input type="button" class="btn" Value = "Send Users to Canvas.instructure.com" id="cx_userToCanvas"></input>');
    }

    //put the checkboxes in
    $('#bodyCell div.pbBody table:contains("Contact Status") th.actionColumn').prepend('<input type="checkbox" class="cx_checkUsers" checked id="cx_checkUsersMaster">'); //Master checkbox
    //user array
    $('#bodyCell div.pbBody table:contains("Contact Status") td.actionColumn').prepend('<input type="checkbox" class="cx_checkUsers" checked>');

    //function to check, or uncheck all based on the master checkbox
    $('#cx_checkUsersMaster').change(function(e){
        e.preventDefault();
        //console.log('here');
        var checkBoxes = $('input.cx_checkUsers:not(:first)');
        checkBoxes.prop("checked", !checkBoxes.prop("checked"));
    });


    $('#cx_userToCanvas').click(function(e){
        $('#cx_canvasURL, #cx_userToCanvas, input.cx_checkUsers').attr('disabled','disabled');
        e.preventDefault();
        //sessionStorage.setItem('userArrayString',getUsers()); //Local storage doesnt seem to be working adding it to the link
        var userString = getUsers();
        userString = userString.trim();
        userString = encodeURI(userString);
        var buildCanvasURL = "https://" + $('#cx_canvasURL').val() + ".instructure.com/cxtools3?sfUsers=true&userData=" + userString;
        openInNewTab(buildCanvasURL);
    });
}

// shorten some text to textLength long and add an ellipses
function shorten(text, textLength){
    if(text.length > textLength){
        text = text.substring(0, textLength) + '&hellip;';
    }
    return text;
}

function fix_permission_header() {
    var existing_label;
    var new_label;

    // very specific selector
    $('table.ic-permissions__table > thead > tr.ic-permissions__top-header > th.ic-permissions__top-header__col-wrapper-th > div > div > span > button > span').each(function(i, obj) {
        existing_label = $(this).text();
        new_label = shorten(existing_label, 18);
        $(this).html(new_label);
    });
}

function append_feature_details(node) {
    const admin_shield_svg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0" y="0" width="24px" height="24px" style="padding-left: 0.25rem; vertical-align: middle;" viewBox="0 0 200 224" enable-background="new 0 0 200 224" xml:space="preserve"><path d="M87,83.47a9.53,9.53,0,1,1-9.53-9.53A9.53,9.53,0,0,1,87,83.47m35.26,62.28h17.29V128.45l-40-40,.44-4.19c.11-13.94-10.3-24.37-23.1-24.37a23.22,23.22,0,0,0,0,46.44l5.31-.6,7.18,7.17h16.86V126h13.14V142.9Zm30,12.71H117l-10.3-10.29v-9.43H93.57V125.59H84.16L77.58,119h-.65a35.93,35.93,0,1,1,35.92-35.92c0,.22,0,.43,0,.64l39.44,39.45ZM99.72,220.06a6.46,6.46,0,0,1-3-.78l-3.93-2.13c-34.84-18.92-82.55-44.81-82.55-99.89V49.59a6.37,6.37,0,0,1,3.65-5.76L97,4.66a6.28,6.28,0,0,1,5.4,0L185.6,43.83a6.37,6.37,0,0,1,3.65,5.76v67.67c0,55.08-47.72,81-82.55,99.89l-3.93,2.13A6.47,6.47,0,0,1,99.72,220.06ZM22.91,53.62v63.64c0,47.52,42.09,70.37,75.9,88.73l.9.48.91-.48c33.81-18.36,75.9-41.21,75.9-88.73V53.62L99.72,17.43Z"></path></svg>';

    node.append('<div style="position: absolute; right: 1rem; padding: 0.25rem; border: 1px solid black; background-color: rgb(239,239,239);">' + admin_shield_svg + ' <a href="https://community.canvaslms.com/t5/Canvas-Resource-Documents/Canvas-Feature-Option-Summary/ta-p/531316">Canvas Feature Option Summary</a></div>');
}

// 20231006 - can't get this to fire at the correct time - really needs to be supplied by the underling code
/*
function append_feature_account_details(node) {
    // attempting to append a feature
    $('#tab-features > div > table > tbody > tr > td > div > button > span > span:contains("Account and Course Level Outcome Mastery Scales")').closest('div').find('div > div > div').append('<br /><a href="">feature definition</a>');
    alert('in append_feature_account_details()')
}
*/

// vim:expandtab ts=4 sw=4
