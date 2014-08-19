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
