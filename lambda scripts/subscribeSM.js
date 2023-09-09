const AWS = require("aws-sdk");
const stepfunctions = new AWS.StepFunctions();
const smArn = process.env.SM_ARN;
if (!smArn) {
  throw new Error("State Machine ARN is required");
}

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
};
module.exports.handler = async (event) => {
  try {
    const { email, preferences } = JSON.parse(event.body)
    const smInput = {
        body: {
            email,
            preferences
        }
    };
    const smParams = {
      stateMachineArn: smArn,
      input: JSON.stringify(smInput),
    };
    await stepfunctions.startExecution(smParams).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Execution Successful",
      }),
      headers: headers,
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
      headers: headers,
    };
  }
};