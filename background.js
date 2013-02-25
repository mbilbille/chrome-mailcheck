chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        var notification = webkitNotifications.createNotification(
            'resources/images/icon48.png',
            chrome.i18n.getMessage("notifTitle"),
            chrome.i18n.getMessage("notifMessage", [request.suggestion])
            );
        notification.show();
        window.setTimeout(function() { notification.close() }, 10000);
    }
    );
