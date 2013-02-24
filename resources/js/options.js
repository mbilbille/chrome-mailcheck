/**
 * Options page for MailCheck extension.
 * 
 * Author
 * Matthieu Bilbille (@bilubilu28)
 */

 var MailCheckOptions = {
    domains: Kicksend.mailcheck.defaultDomains,
    topLevelDomains: [],
    selectors: ['textarea', 'input[type="text"]', 'input[type="email"]'],
    init: function(){
        document.addEventListener('DOMContentLoaded', MailCheckOptions.load(function(){
            MailCheckOptions.restore();
        }));
        $(document).on('blur', ['textarea'], function(e){
                MailCheckOptions.save();
        });
        $(document).on('click', "#showAdvanced", function(e) {
            $(".advanced").toggle();
            $("#showAdvanced").hide();
            $("#hideAdvanced").show();
        });$(document).on('click', "#hideAdvanced", function(e) {
            $(".advanced").toggle();
            $("#hideAdvanced").hide();
            $("#showAdvanced").show();
        });
    },
    save: function(){
        // Retrieve data
        MailCheckOptions.domains = $("#domains").val().replace(/\s+/g, '').split(',');
        MailCheckOptions.topLevelDomains = $("#topLevelDomains").val().replace(/\s+/g, '').split(',');
        MailCheckOptions.selectors = $("#selectors").val().replace(/\s+/g, '').split(',');
        
        // ... and save it
        var data = {
            'domains': MailCheckOptions.domains,
            'topLevelDomains': MailCheckOptions.topLevelDomains,
            'selectors': MailCheckOptions.selectors,
        };
        chrome.storage.sync.set(data, function() {
            // Update status to let user know options were saved.
            var status = $("#status");
            status.html("Options Saved.");
            setTimeout(function() {
                status.html("");
            }, 750);
        });
    },
    load: function(callback){
        chrome.storage.sync.get(['domains', 'topLevelDomains', 'selectors'], function(items){
            for(var i in items) {
                MailCheckOptions[i] = items[i];
            }

            if(typeof callback == "function"){
                callback();
            }
        });
    },
    restore: function(){
        $("#domains").val(MailCheckOptions.domains.join(', '));
        $("#topLevelDomains").val(MailCheckOptions.topLevelDomains.join(', '));
        $("#selectors").val(MailCheckOptions.selectors.join(', '));
    }
};

if($("body").attr('page') === "options"){
    MailCheckOptions.init();
}
