/**
 * Mailcheck for Chrome https://github.com/mbilbille/chrome-mailcheck
 * Author
 * Matthieu Bilbille (@bilubilu28)
 *
 * License
 * Copyright (c) 2012 Receivd, Inc.
 *
 * Licensed under the MIT License.
 *
 * v 1.1
 **/

 var MailCheck = {
    elementTypes: ['textarea', 'input[type="text"]', 'input[type="email"]'],
    domains: [],
    init: function(){
        $(document).on('blur', MailCheck.elementTypes, function(e){
                MailCheck.run(this);
        });
        chrome.storage.sync.get('domains',function(items){
            if(!items.domains){
                MailCheck.domains = Kicksend.mailcheck.defaultDomains;
                chrome.storage.sync.set({'domains': Kicksend.mailcheck.defaultDomains});
            }
            else{
                MailCheck.domains = items.domains;
            }
        });
    },
    run: function(element) {
        var re = /\b([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,5})\b/gi;
        var emails = element.value.match(re);
        for(var i in emails) {
            if(i == "index" || i == "input") {
                continue;
            }
            Kicksend.mailcheck.run ({
                email: emails[i],
                domains: MailCheck.domains,
                suggested: function(suggestion) {
                    chrome.extension.sendMessage({suggestion: suggestion.full});
                },
                empty: function() {
                }
            });
        }
    }
}

MailCheck.init();
