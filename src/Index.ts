import * as alexa from 'alexa-app';
import * as moment from 'moment';
import * as spu from 'spu-api';

const app = new alexa.app('spu');

function getAddress(request): string {
    // TODO: Look for device address in request.
    return process.env.SPU_ADDRESS;
}

app.intent(
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

export = app;
