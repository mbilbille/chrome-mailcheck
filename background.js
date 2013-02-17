chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    var notification = webkitNotifications.createNotification(
      'images/icon48.png',
      'Mailcheck!',
      'Did you mean ' + request.suggestion + '?'
    );
    notification.show();
    window.setTimeout(function() { notification.close() }, 10000);
  }
);
