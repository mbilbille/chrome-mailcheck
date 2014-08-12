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
                        case "notification" : chrome.extension.sendMessage({type: "notification", suggestion: suggestion.full});
                        break;
                        case "tooltip" : ChromeMailcheck.tooltip.show(emails[i], suggestion.full, element);
                        break;
                    }
                    chrome.extension.sendMessage({type: "ga", result: "suggested"});
                },
                empty: function() {
                    chrome.extension.sendMessage({type: "ga", result: "empty"});
                }
            });
        }
    }
};
ChromeMailcheck.extension.init();