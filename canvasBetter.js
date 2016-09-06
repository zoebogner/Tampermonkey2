// ==UserScript==
// @name         Canvas betterments!
// @namespace    https://siteadmin.instructure.com/
// @version      2016.09.06
// @description  try to take over the world!
// @author       Daniel Gilogley
// @match        https://*.test.instructure.com/*
// @match        https://*.beta.instructure.com/*
// @match        https://*.instructure.com/*
// @exclude      https://siteadmin*instructure.com/*
// @grant        none
// ==/UserScript==

var domain = 'https://'+document.location.hostname;

$(document).ready(function(){
    //add the self link
    $('#menu > li:last').after('<li class="menu-item ic-app-header__menu-list-item" id="dg_li_self"> <a id="dg_link_self" href="' + domain + '/accounts/self" class="ic-app-header__menu-list-link"> <div class="menu-item-icon-container" aria-hidden="true"> <div class="ic-avatar "> <img src="http://cdn.shopify.com/s/files/1/0151/3253/articles/smiling-face-with-heart-shaped-eyes_grande.png" alt="Self" title = "Self"> </div> </div> <div class="menu-item__text"> Self </div></a></li>');

    //add the settings link
    $('#menu > li:last').after('<li class="menu-item ic-app-header__menu-list-item" id="dg_li_settings"> <a id="dg_link_settings" href="' + domain + '/accounts/1/settings/configurations" class="ic-app-header__menu-list-link"> <div class="menu-item-icon-container" aria-hidden="true"> <div class="ic-avatar "> <img src="https://cdn3.iconfinder.com/data/icons/fez/512/FEZ-04-128.png" alt="Settings" title = "Settings"></div></div><div class="menu-item__text"> Settings </div></a></li>');

    //remove the images if on the old UI remove the images
    if($('#menu > li:contains("Dashboard")').length <= 0){
        $('#dg_li_self img, #dg_li_settings img').hide();
        $('#dg_link_self, #dg_link_settings').attr('class','menu-item-no-drop');
    }

    //if on the self page
    if(document.location.pathname==="/accounts/self"){
        //focus on the self link
        $('li.ic-app-header__menu-list-item--active').attr('class',"menu-item ic-app-header__menu-list-item");
        $('li#dg_li_self').attr('class',"menu-item ic-app-header__menu-list-item  ic-app-header__menu-list-item--active");
    }else if(document.location.pathname==="/accounts/1/settings" || document.location.pathname==="/accounts/1/settings/configurations"){ //if on the settings page
        //focus on the settings link
        $('li.ic-app-header__menu-list-item--active').attr('class',"menu-item ic-app-header__menu-list-item");
        $('li#dg_li_settings').attr('class',"menu-item ic-app-header__menu-list-item  ic-app-header__menu-list-item--active");

        //---------On the main Settings page of 'Settings-----------------
        //create the button to do the default settings
        $('#account_settings > legend').after('<button type="button" id="dg_button_applyDefaults_settings">Apply defaults</button>');
        //apply the action of clicking the default button
        $('#dg_button_applyDefaults_settings').click(function(e){
            e.preventDefault();
            $('#dg_button_applyDefaults_settings').attr('disabled','disabled').css('cursor','default'); //Disable the button after click

            //apply the defaults on the settings page
            $('#account_default_locale').val($('#account_default_locale > option:contains("English (Australia)")').val()); //Default Language
            $('#account_default_time_zone').val($('#account_default_time_zone option:contains("Sydney (+10:00)")').val()); //Timezone

            //click some of the features if unchecked
            $('#account_settings_admins_can_change_passwords:not(:checked)').click();
            $('#account_settings_admins_can_view_notifications:not(:checked)').click();
            $('#account_allow_sis_import:not(:checked)').click();
            $('#account_settings_global_includes:not(:checked)').click();
            $('#account_settings_enable_profiles:not(:checked)').click();
            $('#account_settings_sub_account_includes:not(:checked)').click();
            $('#account_services_analytics:not(:checked)').click();
            $('#account_services_avatars:not(:checked)').click();

            //Enabled Web Services to none
            $('#account_settings > fieldset:contains("Enabled Web Services") > div:not(:last) input[type="checkbox"]:checked').click();

            //---------On the main Feature page of 'Settings'-----------------
            //check to see if clicked, and if not click them!
            //new UI
            if($('#tab-features > div.account-feature-flags > ul div.row-fluid.feature.use_new_styles div.ic-Super-toggle__switch').css('background-color') === "rgb(89, 89, 89)"){
                $('#tab-features > div.account-feature-flags > ul div.row-fluid.feature.use_new_styles > div.span5.text-right > label > div > div').click();
            }

            //LOR External Tools
            if($('#tab-features > div.account-feature-flags > ul div.row-fluid.feature.lor_for_account div.ic-Super-toggle__switch').css('background-color') === "rgb(89, 89, 89)"){
                $('#tab-features > div.account-feature-flags > ul div.row-fluid.feature.lor_for_account > div.span5.text-right > label > div > div').click();
            }

            //internation SMS
            if($('#tab-features > div.account-feature-flags > ul div.row-fluid.feature.international_sms div.ic-Super-toggle__switch').css('background-color') === "rgb(89, 89, 89)"){
                $('#tab-features > div.account-feature-flags > ul div.row-fluid.feature.international_sms > div.span5.text-right > label > div > div').click();
            }

            //Wrap Calendar titles
            if($('#tab-features > div.account-feature-flags > ul div.row-fluid.feature.wrap_calendar_event_titles div.ic-Super-toggle__switch').css('background-color') === "rgb(89, 89, 89)"){
                $('#tab-features > div.account-feature-flags > ul div.row-fluid.feature.wrap_calendar_event_titles > div.span5.text-right > label > div > div').click();
            }

            //Canvas Parent
            if($('#tab-features > div.account-feature-flags > ul div.row-fluid.feature.canvas_parent div.ic-Super-toggle__switch').css('background-color') === "rgb(89, 89, 89)"){
                $('#tab-features > div.account-feature-flags > ul div.row-fluid.feature.canvas_parent > div.span5.text-right > label > div > div').click();
            }

            //focus on the submit button
            $('html,body').animate({scrollTop: $('#account_settings > div.button-container > button').offset().top},'slow');

            //Notification to user
            $('#account_settings > div.button-container').append('<span><marquee direction="right" loop="20" width="45%"><em>Yes, it`s even applied the Features too!</em></marquee></span>');
        });
        //----------End do the apply default button -----------------------

        //Changes to the 'Apps' tab  - only if you click on my settings link, and did not navigate there natuarally
        $('#account_settings_tabs > ul > li:contains("Apps"):first > a:first').click(function(a){
            a.preventDefault();
            setTimeout(function(){
                $('#external_tools > div > div > div.Header > h2 > div > span.AddExternalToolButton > a.btn.btn-primary.add_tool_link.lm').click(function(b){
                    b.preventDefault();
                    setTimeout(function(){
                        $('body > div.ReactModalPortal > div > div > div > div > div.ReactModal__Header-Title > h4').after('<button type="button" id="dg_button_canvasCommons">Canvas Commons</button>');
                        var name = "Commons Setup";
                        var consumerKey = "1";
                        var sharedSecret = "c9b6c488-4750-48ce-897c-b919ff3cb0f1";
                        var configURL = "https://lor.instructure.com/api/account-setup/tool-config";
                        $('#dg_button_canvasCommons').click(function(c){
                            c.preventDefault();
                            $('#dg_button_canvasCommons').attr('disabled','disabled').css('cursor','default'); //Disable the button after click

                            //select URL
                            $('#configuration_type_selector-bs > ul > li:nth-child(2) > a').click();
                            //apply the values to the fields
                            $('body > div.ReactModalPortal > div > div > div > form > div.ReactModal__Body > div.formFields > div > div:nth-child(1) > label > input[placeholder="Name"]:first').val(name);
                            $('body > div.ReactModalPortal > div > div > div > form > div.ReactModal__Body > div.formFields > div > div:nth-child(2) > div:nth-child(1) > div > label > input[placeholder="Consumer key"]').val(consumerKey);
                            $('body > div.ReactModalPortal > div > div > div > form > div.ReactModal__Body > div.formFields > div > div:nth-child(2) > div:nth-child(2) > div > label > input[placeholder="Shared Secret"]').val(sharedSecret);
                            $('body > div.ReactModalPortal > div > div > div > form > div.ReactModal__Body > div.formFields > div > div:nth-child(3) > label > input[placeholder="Config URL"]').val(configURL);//*/

                            //focus on the submit
                            $('body > div.ReactModalPortal > div > div > div > form > div.ReactModal__Footer > div > button.btn.btn-primary').focus();
                        });
                    }, 100);
                });
            },100);
        });
    }
});
