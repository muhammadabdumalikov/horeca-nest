import firebase from 'firebase-admin';
import axios from 'axios';

const serviceAccount = require("./horeca.json");

// const topicName = 'HORECA';
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount)
})

export interface IFirebaseTopicMessage {
  notification: {
    title: string;
    body: string;
  },
  data: any,
  topic: string;
}

export const sendFirebaseToTopic = async (message: IFirebaseTopicMessage) => {
  // message.topic = topicName;

  return firebase.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
}

export const sendFirebaseNotification =async (message: IFirebaseTopicMessage) => {
  return axios.post('https://fcm.googleapis.com/fcm/send', {
    to: `/topics/${message.topic}`,
    notification: {
      title: message.notification.title,
      body: message.notification.body
    },
    data: message.data
  }, {
    headers: {
      Authorization: "key=AAAAaXJ76ro:APA91bEizcj7WkvtdCEKiKh02gHhmMiab1TCixRzZFvTMs5uaPTRx84-9JtezdYSOB73Ddhk2Ovfbk5ZtzeUA1OlgllwJVlbpeRCh_KCYAvkQb-4XOuxdCDcMNBVjuxhMCR_WoOdupLa"
    }
  })
}