 var _gaq = _gaq || [];
 _gaq.push(['_setAccount', 'UA-40642304-1']);
 _gaq.push(['_trackPageview']);

 (function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.type == "ga"){
            _gaq.push(['_trackEvent', 'mailcheck', request.result]);
        }
        if(request.type == "notification"){
        var notification = webkitNotifications.createNotification(
            'resources/images/icon128.png',
            chrome.i18n.getMessage("notifTitle"),
            chrome.i18n.getMessage("notifMessage", [request.suggestion])
            );
        notification.show();
        window.setTimeout(function() { notification.close() }, 10000);
        }
    }
);
