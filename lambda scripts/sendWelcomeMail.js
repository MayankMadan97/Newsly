const AWS = require('aws-sdk');
const sns = new AWS.SNS();

module.exports.handler = async (event) => {
    let response = {};


    if (event.body) {
        const requestBody = JSON.parse(event.body);
        console.log("Request Body: " + JSON.stringify(requestBody));
        const topics = await sns.listTopics({}).promise();
        // Get the list of subscriptions for the specified SNS topic
        console.log("Email: " + requestBody.email + " || topic: " + requestBody.topic);
        const topic = topics.Topics.find((t) => t.TopicArn.includes(requestBody.topic)).TopicArn;
        console.log("topic found: " + JSON.stringify(topic));
        const snsResponse = await sns.listSubscriptionsByTopic({ TopicArn: topic }).promise();
        console.log("Subscriptions: " + JSON.stringify(snsResponse));
        // Check if the email endpoint is subscribed to the SNS topic
        let isSubscribed = false;
        for (const subscription of snsResponse.Subscriptions) {
            console.log("Subscription: " + JSON.stringify(subscription));
            if (subscription.Protocol === 'email' && subscription.Endpoint === requestBody.email && subscription.SubscriptionArn !== "PendingConfirmation") {
                isSubscribed = true;
                await sns.publish({
                    TopicArn: topic,
                    Message: "Welcome to NEWSLY " + requestBody.topic + " newsletters. We'll keep you updated with the changing environment of " + requestBody.topic + "."
                }).promise();
                break;
            }
        }

        response = {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*', // Replace '*' with your frontend domain if needed
                'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Add any other required headers
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE', // Add the allowed methods
                'Access-Control-Allow-Credentials': true, // Set to true if your requests include credentials (e.g., cookies)
            },
            body: JSON.stringify({ status: isSubscribed }),
        };
    }

    return response;
};
