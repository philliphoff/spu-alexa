import * as express from 'express';
import * as alexa from 'alexa-app';
import * as spu from 'spu-api';
import * as moment from 'moment';

const expressApp = express();

expressApp.set('view engine', 'ejs');

const alexaApp = new alexa.app('spu');

function getAddress(request): string {
    // TODO: Look for device address in request.
    return process.env.SPU_ADDRESS;
}

alexaApp.intent(
    'collection-day',
    {
        'slots': { },
        'utterances': [
            'when is collection day'
        ]
    },

    function(request, response) {
        return new Promise((resolve, reject) => {
            spu.getCollectionDays(getAddress(request), (err, days) => {
                if (err) {
                    return reject(err);
                }

                const sortedDays = [...days].sort((a, b) => b.date.valueOf() - a.date.valueOf()); 
                
                const now = new Date();

                const futureDays = sortedDays.filter(day => day.date.valueOf() >= now.valueOf());

                if (futureDays.length) {
                    const date = moment(futureDays[0].date);
                    response.say(`Your next collection day is ${date.format('dddd')}.`);
                }
                else {
                    response.say('Sorry, but I could not find any future collection days.');
                }
                
                resolve();
            });
        });
    }
);

export = alexaApp;

/*
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
*/
