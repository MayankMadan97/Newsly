// aws-sdk dependency to interact with AWS services
const AWS = require('aws-sdk');
// dynamoDB variable
const dynamodb = new AWS.DynamoDB();

module.exports.handler = async (event) => {
    let response = {};
    // table already provisioned
    const newsletterTable = 'newsletter_preferences';
    console.log("savePreferences:: event: " + event);
    if (event && event.body) {
        // extracting preferences
        const jsonifiedBody = event.body;
        const email = jsonifiedBody.email;
        const preferences = jsonifiedBody.preferences;
        if (email) {
            // pushing the preferences to dynamoDB
            await dynamodb.putItem({
                TableName: newsletterTable,
                Item: {
                    email: { "S": "" + email },
                    technology: { "BOOL": !!preferences.technology },
                    business: { "BOOL": !!preferences.business },
                    science: { "BOOL": !!preferences.science },
                    sports: { "BOOL": !!preferences.sports },
                    international: { "BOOL": !!preferences.international },
                    politics: { "BOOL": !!preferences.politics },
                }
            }).promise();
        } else {
            // if email not found, return unprocessible entity
            return { statusCode: 422, body: JSON.stringify('Invalid parameters') };
        }
        response = {
            statusCode: 201,
            body: { email: email, preferences: preferences, message: "preferences stored successfully" },
        };
    }
    return response;
};
