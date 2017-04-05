import * as express from 'express';
import * as alexa from 'alexa-app';

const expressApp = express();

expressApp.set("view engine", "ejs");

const alexaApp = new alexa.app('spu');

alexaApp.intent("number", {
    "slots": { "number": "AMAZON.NUMBER" },
    "utterances": ["say the number {-|number}"]
  },
  function(request, response) {
    var number = request.slot("number");
    response.say("You asked for the number " + number);
  }
);

// setup the alexa app and attach it to express before anything else
alexaApp.express({
    // TODO: Remove these for production!
    checkCert: false,
    debug: true,

    expressApp
});

expressApp.listen(3000, () => {
    console.log('Listening on port 3000...');
});
