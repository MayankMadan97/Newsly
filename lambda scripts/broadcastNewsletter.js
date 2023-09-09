// aws-sdk dependency to interact with AWS services
const AWS = require('aws-sdk');

// convert email to html format
function convertToHtml(text) {
    const lines = text.split('\n');
    const paragraphs = lines.map(line => `<p>${line}</p>`);
    const htmlContent = paragraphs.join('\n');
    return `<html>${htmlContent}</html>`;
}

let processedMessageIds = new Set(); // Use Set to efficiently track processed message IDs

// method to poll queue for messages with maximum values in case of large number of newsletters
async function pollQueue(queueUrl) {
    const params = {
        QueueUrl: queueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 20,
    };
    // SQS and SNS variables initiated
    const sns = new AWS.SNS();
    const sqs = new AWS.SQS();
    const s3 = new AWS.S3({ region: "us-east-1" });
    try {
        // polling SQS to get data and all messages within configured polling values
        const data = await sqs.receiveMessage(params).promise();
        // Processing received values
        console.log("Received messages " + JSON.stringify(data));
        if (data.Messages) {
            // if messages found, look for SNS topics to broadcast to
            const topics = await sns.listTopics({}).promise();
            console.log("TOPICS: " + JSON.stringify(topics));
            console.log("Message length before removing duplication: " + data.Messages.length);

            for (const message of data.Messages) {
                const body = JSON.parse(message.Body);
                const messageId = body.messageId; // Assuming the message contains a field named 'messageId' for uniqueness

                if (!processedMessageIds.has(messageId)) {
                    const s3Object = await s3.getObject({ Bucket: body.bucketName, Key: body.fileName }).promise();
                    const fileContent = s3Object.Body.toString();
                    console.log('Extracted file:', fileContent);

                    // looking for topic to broadcast newsletter at
                    const topicArn = topics.Topics.find((t) => t.TopicArn.includes(body.topic)).TopicArn;
                    processedMessageIds.add(messageId); // Add the messageId to the Set of processed message IDs

                    await sns.publish({
                        TopicArn: topicArn,
                        Message: convertToHtml(fileContent),
                    }).promise();

                    // After pushing the message to SNS, delete the message from SQS queue
                    try {
                        await sqs.deleteMessage({ QueueUrl: queueUrl, ReceiptHandle: message.ReceiptHandle }).promise();
                    } catch (err) {
                        console.error('Error deleting message from SQS queue:', err);
                    }
                } else {
                    console.log('Skipping duplicate message with messageId:', messageId);
                }
            }
        }
    } catch (err) {
        console.error('Error polling SQS queue:', err);
    }
    pollQueue(queueUrl);
}

module.exports.handler = async (event) => {
    const sqs = new AWS.SQS();
    let queueUrl;
    try {
        const data = await sqs.getQueueUrl({ QueueName: 'newsletter-scheduler' }).promise();
        queueUrl = data.QueueUrl;
        console.log('SQS Queue URL:', queueUrl);
    } catch (err) {
        console.error('Error getting SQS queue URL:', err);
        return;
    }

    // Start polling the queue
    await pollQueue(queueUrl);

    const response = {
        statusCode: 200,
        body: JSON.stringify('Broadcasting successful'),
    };
    return response;
};
