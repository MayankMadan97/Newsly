// aws-sdk dependency to interact with AWS services
const AWS = require('aws-sdk');
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

module.exports.handler = async (event) => {
    // variables for S3 and SQS
    const sqs = new AWS.SQS();
    const s3 = new AWS.S3();
    let sqsQueueUrl; // SQS queue url looked for in runtime

    // extracting content and file name persisted in the S3 bucket triggering this code
    const fileName = event.Records[0].s3.object.key;
    const bucketResponse = await s3.getObject({ Bucket: event.Records[0].s3.bucket.name, Key: fileName }).promise();
    // ensuring the content type of file content to be utf-8
    const content = bucketResponse.Body.toString('utf-8');
    console.log("FileName: " + fileName + " || Content: " + content);
    // queue name known created at provisoning time
    await sqs.getQueueUrl({ QueueName: "newsletter-scheduler" }, (err, data) => {
        if (err) {
            console.error('Filed to get SQS queue URL:', err);
        } else {
            console.log('SQS Queue URL found:', data.QueueUrl);
            sqsQueueUrl = data.QueueUrl;
        }
    }).promise();
    if (sqsQueueUrl) {
        // scheduling message in SQS queue to ensure sending the newsletter out when time comes
        await sqs.sendMessage({
            MessageBody: JSON.stringify({ messageId: getRandomInt(1, 2555), fileName: fileName, bucketName: event.Records[0].s3.bucket.name, topic: event.Records[0].s3.bucket.name.replace("-newsletter", "") }),
            QueueUrl: sqsQueueUrl
        }, (err, data) => {
            if (err) {
                console.error('Failed to send message to SQS:', err);
            } else {
                console.log('Message sent to SQS successfully. MessageId: ', data.MessageId);
                return {
                    statusCode: 200,
                    body: JSON.stringify('Message ID: ' + data.MessageId),
                };
            }
        }).promise();
    }
    const response = {
        statusCode: 500,
        body: JSON.stringify('Failed to schedule newsletter'),
    };
    return response;
};
