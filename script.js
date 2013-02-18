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
    init: function(){
        var inputs = document.querySelectorAll('textarea, input[type="text"], input[type="email"]');
        for (var i in inputs) {
            MailCheck.live("blur", inputs[i], function(element){
                MailCheck.run(element);
            });
        }
    },
    live: function(eventType, element, callback) {
        document.addEventListener(eventType, function (event) {
            if (event.target === element) {
                callback.call(event.target, event.target);
            }
        }, true);
    },
    run: function(element) {
        var re = /\b([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4})\b/gi;
        var emails = element.value.match(re);
        for(var i in emails) {
            if(i == "index" || i == "input") {
                continue;
            }
            Kicksend.mailcheck.run ({
                email: emails[i],
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
