// aws-sdk dependency to interact with AWS services
const AWS = require('aws-sdk');

module.exports.handler = async (event) => {
  // setting AWS region and SNS variable
  AWS.config.update({ region: 'us-east-1' });
  const sns = new AWS.SNS();

  // subscription creation logic, currently only mail is supported by application
  const createSubscription = async (endpoint, topicArn) => {
    try {
      const data = await sns.subscribe({ Protocol: "email", TopicArn: topicArn, Endpoint: endpoint }).promise();
      console.log('Subscription successfull: ', data.SubscriptionArn);
      return data.SubscriptionArn;
    } catch (err) {
      console.error('Subscription failed:', err);
      throw err;
    }
  };

  if (event.body) {
    const requestBody = event.body;
    if (requestBody.preferences && requestBody.email) {
      // if preferences and email are present, list topics in SNS
      const topics = await sns.listTopics({}).promise();
      console.log("Stack: " + JSON.stringify(requestBody.preferences) + " || SNS topics: " + JSON.stringify(topics));
      for (const stack in requestBody.preferences) {
        if (requestBody.preferences[stack] === true) {
          // for each preference, find respective topic in SNS and create email subscription for that endpoint
          const topic = topics.Topics.find((t) => t.TopicArn.includes(stack));
          await createSubscription(requestBody.email, topic.TopicArn);
        }
      }
      return {
        statusCode: 200,
        body: JSON.stringify("Notifications sent successfully to " + requestBody.email),
      };
    }
  }
  return {
    statusCode: 500,
    body: JSON.stringify("Failed to send notification"),
  };
};
