/**
 * Mailcheck for Chrome https://github.com/mbilbille/chrome-mailcheck
 * Author
 * Matthieu Bilbille (@bilubilu28)
 *
 * Licensed under the MIT License.
 *
 * v 1.5.1
 **/

var mailcheck = mailcheck || {};
mailcheck.extension = {
    init: function(){
        mailcheck.options.load(function(){
            $(document).on('blur', mailcheck.options.selectors, function(e){
                mailcheck.extension.run(this);
            });
        });
    },
    run: function(element) {
        var re = /\b([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6})\b/gi;
        var emails = element.value.match(re);
        for(var i in emails) {
            if(i == "index" || i == "input") {
                continue;
            }
            Kicksend.mailcheck.run ({
                email: emails[i],
                domains: mailcheck.options.domains,
                topLevelDomains: mailcheck.options.topLevelDomains,
                suggested: function(suggestion) {
                    switch(mailcheck.options.alertType){
                        case "notification" : chrome.extension.sendMessage({type: 'notification', suggestion: suggestion.full});
                        break;
                        case "tooltip" : mailcheck.tooltip.create(emails[i], suggestion.full).show($(element));
                        break;
                    } 
                    chrome.extension.sendMessage({type: 'ga', result: 'suggested'});
                },
                empty: function() {
                    chrome.extension.sendMessage({type: 'ga', result: 'empty'});
                }
            });
        }
    }
};
mailcheck.extension.init();
