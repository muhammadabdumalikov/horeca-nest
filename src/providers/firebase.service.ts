import firebase from 'firebase-admin';

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