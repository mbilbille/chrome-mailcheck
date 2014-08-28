/*
 *  Mailcheck for Chrome - v1.6.0.4
 *  Chrome extension to suggests a right domain when your users misspell it in an email address
 *  https://github.com/mbilbille/chrome-mailcheck
 *
 *  Made by Matthieu Bilbille
 *  Under MIT License
 */
/**
 * Options page for MailCheck extension.
 *
 * Author
 * Matthieu Bilbille (@bilubilu28)
 */

 var ChromeMailcheck = ChromeMailcheck || {};
 // Force support of 'fr' top level domain
 Mailcheck.defaultTopLevelDomains.push("fr");
 ChromeMailcheck.options = {
    alertType: "tooltip",
    displayTime: 10000,
    domains: Mailcheck.defaultDomains,
    topLevelDomains: Mailcheck.defaultTopLevelDomains,
    selectors: ["textarea", "input[type='text']", "input[type='email']"],

    init: function(){
        document.addEventListener("DOMContentLoaded", ChromeMailcheck.options.load(function(){
            ChromeMailcheck.options.restore();
        }));
        $(document).on("blur", "textarea, input", ChromeMailcheck.options.save.bind(this));
        $(document).on("change", "input[type='radio']", ChromeMailcheck.options.save.bind(this));
        $(document).on("click", "#showAdvanced", function() {
            $(".advanced").toggle();
            $("#showAdvanced").hide();
            $("#hideAdvanced").show();
        });
        $(document).on("click", "#hideAdvanced", function() {
            $(".advanced").toggle();
            $("#hideAdvanced").hide();
            $("#showAdvanced").show();
        });
        $(document).on("click", "#status .delete", function() {
            $("#status").html("");
        });
    },
    save: function(){
        // Retrieve data
        this.domains = $("#domains").val().replace(/\s+/g, "").split(",");
        $("input[name='alertType']").each(function(){
            if(this.checked === true){
                ChromeMailcheck.options.alertType = $(this).val();
            }
        });
        this.displayTime = $("#displayTimeNotification").val() * 1000;
        this.topLevelDomains = $("#topLevelDomains").val().replace(/\s+/g, "").split(",");
        this.selectors = $("#selectors").val().replace(/\s+/g, "").split(",");

        // ... and save it
        var data = {
            "domains": this.domains,
            "alertType": this.alertType,
            "displayTime": this.displayTime,
            "topLevelDomains": this.topLevelDomains,
            "selectors": this.selectors,
        };
        chrome.storage.sync.set(data, function() {
            // Update status to let user know options were saved.
            $("#status").html("<p class='alert'>Settings saved.</p>");
            setTimeout(function() {
                $("#status").html("");
            }, 1000);
        });
    },
    load: function(callback){
        chrome.storage.sync.get(["domains", "topLevelDomains", "selectors", "alertType", "displayTime"], function(items){
            for(var i in items) {
                ChromeMailcheck.options[i] = items[i];
            }

            if(typeof callback === "function"){
                callback();
            }
        });
    },
    restore: function(){
        $("#domains").val(this.domains.join(", "));
        $("#topLevelDomains").val(this.topLevelDomains.join(", "));
        $("#selectors").val(this.selectors.join(", "));
        $("input[name='alertType'][value='" + this.alertType + "']").attr("checked", "true");
        $("#displayTimeNotification").val(this.displayTime / 1000);
    },
    localize: function() {
        $("[i18n-content]").each(function() {
            $(this).html(chrome.i18n.getMessage($(this).attr("i18n-content")));
        });
    }
};

if($("body").attr("page") === "options"){
    ChromeMailcheck.options.init();
    ChromeMailcheck.options.localize();
}

/**
 * Tooltip extension for MailCheck extension.
 *
 * Author
 * Matthieu Bilbille (@bilubilu28)
 */
 var ChromeMailcheck = ChromeMailcheck || {};
 ChromeMailcheck.tooltip = {
    id: "",
    source: "",
    suggestion: {},
    element: null,
    timeout: 0,
    flag: false,

    options: {
        container: "body",
        placement: "bottom",
        trigger: "manual",
        html: "true",
        template: "<div class='cm-tooltip tooltip' role='tooltip'><button type='button' class='cm-close'><span>&times;</span></button><div class='cm-tooltip-arrow tooltip-arrow'></div><div class='cm-tooltip-inner tooltip-inner'></div></div>"
    },

    show: function(source, suggestion, element) {
        this.source = source;
        this.suggestion = suggestion;

        // Generate tooltip
        $(element).tooltip($.extend({}, ChromeMailcheck.tooltip.options, {
           title: chrome.i18n.getMessage("notifMessage", ["<br /><a class='cm-link' href='#'>" + suggestion.full + "</a>"])
        }));

        // ... and show
        $(element).tooltip("show");
        var id = $(element).attr("aria-describedby");

        // close tooltip
        //  - automatically after x seconds
        //  - manually closed
        //  - click on suggestion
        clearTimeout(this.timeout);
        this.timeout = window.setTimeout(function() {
            ChromeMailcheck.tooltip.hide(element);
        }, ChromeMailcheck.options.displayTime);
        $("#" + id + " .cm-close").on("click", function() {
            (ChromeMailcheck.tooltip.flag) ? ChromeMailcheck.tooltip.hide(element) : ChromeMailcheck.tooltip.addDomain(element);
        });
        $("#" + id + " a").on("click", function(e){
            e.preventDefault();
            var val = $(ChromeMailcheck.tooltip.element).val();
            val = val.replace(ChromeMailcheck.tooltip.source, ChromeMailcheck.tooltip.suggestion.full);
            $(ChromeMailcheck.tooltip.element).val(val);
            ChromeMailcheck.tooltip.hide(element);
        });
    },

    reset: function(element) {
        var id = $(element).attr("aria-describedby");
        clearTimeout(this.timeout);
        $("#" + id).children("a").off("click");
    },

    hide: function(element) {
        var id = $(element).attr("aria-describedby");
        ChromeMailcheck.tooltip.reset(element);
        $(element).tooltip("destroy");
        $("#" + id + " .cm-close").off("click");
        this.flag = false;
    },

    addDomain: function(element) {
        var id = $(element).attr("aria-describedby");
        var domain = ChromeMailcheck.tooltip.source.replace(/.*@/, "");
        ChromeMailcheck.tooltip.reset(element);
        $(".tooltip-inner").html(chrome.i18n.getMessage("notifAddToWhitelist", ["<a class='cm-link' href='#'>" + domain + "</a>"]));
        $("#" + id + " a").on("click", function(e){
            e.preventDefault();
            ChromeMailcheck.options.domains.push(domain);
            chrome.storage.sync.set({"domains" : ChromeMailcheck.options.domains});
            ChromeMailcheck.tooltip.hide(element);
        });
        this.flag = true;
    }
};

/**
 * Mailcheck for Chrome https://github.com/mbilbille/chrome-mailcheck
 * Author
 * Matthieu Bilbille (@bilubilu28)
 *
 * Licensed under the MIT License.
 *
 * v 1.6.0
 **/

var ChromeMailcheck = ChromeMailcheck || {};
ChromeMailcheck.extension = {
    init: function(){
        ChromeMailcheck.options.load(function(){
            $(document).on("blur", ChromeMailcheck.options.selectors.join(","), function(){
                ChromeMailcheck.extension.run(this);
            });
            $(document).on("change", ChromeMailcheck.options.selectors.join(","), function(){
                ChromeMailcheck.extension.reset(this);
            });
        });
    },
    run: function(element) {
        var re = /\b([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6})\b/gi;
        var emails = element.value.match(re);
        for(var i in emails) {
            Mailcheck.run ({
                email: emails[i],
                domains: ChromeMailcheck.options.domains,
                topLevelDomains: ChromeMailcheck.options.topLevelDomains,
                suggested: function(suggestion) {
                    switch(ChromeMailcheck.options.alertType){
                        case "notification" : chrome.runtime.sendMessage({type: "notification", suggestion: suggestion, displayTime: ChromeMailcheck.options.displayTime});
                        break;
                        case "tooltip" : ChromeMailcheck.tooltip.show(emails[i], suggestion, element);
                        break;
                    }
                    chrome.runtime.sendMessage({type: "ga", result: "suggested"});
                },
                empty: function() {
                    chrome.runtime.sendMessage({type: "ga", result: "empty"});
                }
            });
        }
    },
    reset: function(element) {
        switch(ChromeMailcheck.options.alertType){
            case "notification" : // Not supported yet.
            break;
            case "tooltip" : ChromeMailcheck.tooltip.hide(element);
            break;
        }
    }
};
ChromeMailcheck.extension.init();
