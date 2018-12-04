import firebase from 'react-native-firebase';
// Optional flow type
import type { RemoteMessage } from 'react-native-firebase';

export default async (message: RemoteMessage) => {
    // handle your message
    console.log('Background Message Received');
    console.log(JSON.stringify(message));

    let data = JSON.parse(message.data.message);
    const notification = new firebase.notifications.Notification()
        .setNotificationId(message.messageId)
        .setTitle(data.notice_title)
        .setBody(data.notice_content)
        .setData(data);
    notification
        .android.setChannelId('com.simicart')
        .android.setSmallIcon('ic_launcher');
    firebase.notifications().displayNotification(notification)
    return Promise.resolve();
}