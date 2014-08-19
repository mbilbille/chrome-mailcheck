 var _gaq = _gaq || [];
 _gaq.push(['_setAccount', 'UA-40642304-1']);
 _gaq.push(['_trackPageview']);

 (function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

chrome.runtime.onMessage.addListener(
    function(request, sender) {
        if(request.type == "ga"){
            _gaq.push(['_trackEvent', 'mailcheck', request.result]);
        }
        if(request.type == "notification"){
            var notification = chrome.notifications.create('', {
                type: "basic",
                iconUrl: 'resources/images/icon128.png',
                title: chrome.i18n.getMessage("notifTitle"),
                message: chrome.i18n.getMessage("notifMessage", [request.suggestion.full])
            }, function(notificationId) {
                window.setTimeout(function() { chrome.notifications.clear(notificationId, function(wasCleared) {}) }, ChromeMailcheck.options.displayTime);
            });
        }
    }
);
