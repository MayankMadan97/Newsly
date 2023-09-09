// aws-sdk dependency to interact with AWS services
const AWS = require('aws-sdk');

module.exports.handler = async (event) => {
    // setting up region for AWS
    AWS.config.update({ region: 'us-east-1' });
    const s3 = new AWS.S3();

    // random method to suffix after file-name for uniqueness
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
    }

    // creating S3 configuration required to push the file
    const jsonifiedBody = JSON.parse(event.body);
    const bucketName = jsonifiedBody.topic + "-newsletter";
    const s3Key = jsonifiedBody.fileName + "-" + getRandomInt(1, 25555);
    const contentToUpload = JSON.stringify(jsonifiedBody.content);
    console.log(bucketName + " Uploading file with name: " + s3Key + " having content: " + contentToUpload);
    try {
        await s3.putObject({ Bucket: bucketName, Key: s3Key, Body: contentToUpload, ContentType: 'application/json' }).promise();
        return { statusCode: 201, body: JSON.stringify("Newsletter uploaded successfully") };
    } catch (error) {
        console.error('Error uploading content to S3:', error);
        return { statusCode: 500, body: JSON.stringify("Failed to upload newsletter") };
    }
};
