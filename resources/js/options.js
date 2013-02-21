/**
 * Options page for MailCheck extension.
 * 
 * Author
 * Matthieu Bilbille (@bilubilu28)
 */

 var MailCheckOptions = {
    init: function(){
        document.addEventListener('DOMContentLoaded', MailCheckOptions.restore);
        document.querySelector('#save').addEventListener('click', MailCheckOptions.save);
    },
    save: function(){
        var domains = $("#domains").val().replace(/\s+/g, '').split(',');

        console.log(domains);

        // Update status to let user know options were saved.
        chrome.storage.sync.set({'domains': domains}, function() {
            var status = document.getElementById("status");
            status.innerHTML = "Options Saved.";
            setTimeout(function() {
                status.innerHTML = "";
            }, 750);
        });
    },
    restore: function(){
        chrome.storage.sync.get('domains', function(items){
            document.getElementById("domains").innerHTML = items.domains.join(', ');
        });
    }
};

MailCheckOptions.init();
