window.addEvent('domready', function () {
	var notifications = new gx.com.Notification();

	notifications.add('Test notification', gx.com.Notification.TYPE_INFO);
	notifications.add('Do not cross the street', gx.com.Notification.TYPE_WARNING);
	notifications.add('Fail', gx.com.Notification.TYPE_ERROR);
});
