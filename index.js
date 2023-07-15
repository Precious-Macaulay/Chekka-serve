//create an instance of express
const express = require('express');
const app = express();
const port = 3000;

//load the environment variables
require('dotenv').config();

//load the body parser module
const bodyParser = require('body-parser');

//Load the azure sdk for form recognizer
const { DocumentAnalysisClient, AzureKeyCredential } = require("@azure/ai-form-recognizer");

const apiKey = process.env.FORM_RECOGNIZER_API_KEY;
const endpoint = process.env.FORM_RECOGNIZER_ENDPOINT;

const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(apiKey));

async function analyzeReceipt(imageUrl) {
    const poller = await client.beginAnalyzeDocument("prebuilt-document", imageUrl, {
        onProgress: (state) => { console.log(`analyzing status: ${state.status}`); }
    });
    const result = await poller.pollUntilDone();

    // Process the result and extract the relevant information from the receipt
    console.log(result.keyValuePairs);
}

//load the twilio module
const twilio = require('twilio');
const { MessagingResponse } = twilio.twiml;
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;

//configure body-parser for express
app.use(bodyParser.urlencoded({ extended: false }));

//create a route for the app
app.get('/', (req, res) => {
    res.send('Hello World!');
}
);

//create a incoming message route for the app
app.post('/incoming', (req, res) => {
    console.log(req.body);
    // if req.body.MediaUrl0 is not null, then call the analyzeReceipt function
    if (req.body.MediaUrl0) {
        console.log(req.body.MediaUrl0);
        analyzeReceipt(req.body.MediaUrl0);
    }

    //create a response
    const twiml = new MessagingResponse();
    twiml.message('The Robots are coming! Head for the hills!');
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
}
);


//listen on port 3000
app.listen(port, () => {
    console.log(`whatsapp bot listening at http://localhost:${port}`);
}
);