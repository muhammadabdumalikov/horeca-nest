import axios from "axios";

export const sendSmsTo = async (receiver, message_key, genNumber) => {
  const postData = {
    messages: [
      {
        recipient: `${receiver}`,
        "message-id": `${message_key}`,
        sms: {
          originator: "3700",
          content: {
            text: `HD HORECA DISTRIBUTION: Ваш код подтверждения: ${genNumber}`,
          },
        },
      },
    ],
  };

  const axiosConfig = {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: process.env.SMS_BASIC_TOKEN,
    },
  };

  axios
    .post("https://send.smsxabar.uz/broker-api/send", postData, axiosConfig)
    .then((res) => {
      return;
    })
    .catch((error) => {
      new Error(error);
      console.log("ERROR: ", error);
    });
};