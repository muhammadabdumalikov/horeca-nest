import * as admin from 'firebase-admin';

import serviceAccount from "../shared/utils/horeca.json";

// const topicName = 'HORECA';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

export interface IFirebaseTopicMessage {
  notification: {
    title: string;
    body: string;
  },
  topic: string;
}

export const sendFirebaseToTopic = async (message: IFirebaseTopicMessage) => {
  // message.topic = topicName;

  return admin.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });
}