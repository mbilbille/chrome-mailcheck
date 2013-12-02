/**
 * Options page for MailCheck extension.
 * 
 * Author
 * Matthieu Bilbille (@bilubilu28)
 */

 var mailcheck = mailcheck || {};
 mailcheck.options = {
    alertType: "tooltip",
    domains: Kicksend.mailcheck.defaultDomains,
    topLevelDomains: [],
    selectors: ['textarea', 'input[type="text"]', 'input[type="email"]'],

    init: function(){
        document.addEventListener('DOMContentLoaded', mailcheck.options.load(function(){
            mailcheck.options.restore();
        }));
        $(document).on('blur', 'textarea, input', mailcheck.options.save.bind(this));
        $(document).on('change', 'input[type="radio"]', mailcheck.options.save.bind(this));
        $(document).on('click', '#showAdvanced', function(e) {
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
        this.domains = $('#domains').val().replace(/\s+/g, '').split(',');
        $('input[name="alertType"]').each(function(){
            if(this.checked == true){
                mailcheck.options.alertType = $(this).val();
            }
        });
        this.topLevelDomains = $('#topLevelDomains').val().replace(/\s+/g, '').split(',');
        this.selectors = $('#selectors').val().replace(/\s+/g, '').split(',');        

        // ... and save it
        var data = {
            'domains': this.domains,
            'alertType': this.alertType,
            'topLevelDomains': this.topLevelDomains,
            'selectors': this.selectors,
        };
        chrome.storage.sync.set(data, function() {
            // Update status to let user know options were saved.
            var status = $('#status');
            status.html('Options Saved.');
            setTimeout(function() {
                status.html('');
            }, 750);
        });
    },
    load: function(callback){
        chrome.storage.sync.get(['domains', 'topLevelDomains', 'selectors', 'alertType'], function(items){
            for(var i in items) {
                mailcheck.options[i] = items[i];
            }

            if(typeof callback == 'function'){
                callback();
            }
        });
    },
    restore: function(){
        $('#domains').val(this.domains.join(', '));
        $('#topLevelDomains').val(this.topLevelDomains.join(', '));
        $('#selectors').val(this.selectors.join(', '));
        $('input[name="alertType"][value="' + this.alertType + '"]').attr('checked', 'true');
    },
    localize: function() {
        $('[i18n-content]').each(function() {
            $(this).html(chrome.i18n.getMessage($(this).attr('i18n-content')));
        });
    }
};

if($('body').attr('page') === 'options'){
    mailcheck.options.init();
    mailcheck.options.localize();
}
