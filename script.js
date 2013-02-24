/**
 * Mailcheck for Chrome https://github.com/mbilbille/chrome-mailcheck
 * Author
 * Matthieu Bilbille (@bilubilu28)
 *
 * Licensed under the MIT License.
 *
 * v 1.3
 **/

 var MailCheck = {
    init: function(){
        MailCheckOptions.load(function(){
            $(document).on('blur', MailCheckOptions.selectors, function(e){
                MailCheck.run(this);
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
                domains: MailCheckOptions.domains,
                topLevelDomains: MailCheckOptions.topLevelDomains,
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
