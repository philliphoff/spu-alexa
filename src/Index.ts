import * as alexa from 'alexa-app';
import * as moment from 'moment';
import * as spu from 'spu-api';

const app = new alexa.app('spu');

function getAddress(request): string {
    // TODO: Look for device address in request.
    return process.env.SPU_ADDRESS;
}

function getCollectionDays(address: string): Promise<spu.ICollectionDay[]> {
    return new Promise(
        (resolve, reject) => {
            spu.getCollectionDays(
                address,
                (err, days) => {
                    if (err) {
                        return reject(err);
                    };

                    resolve(days);
                });
        });
}

app.intent(
    'collection-day',
    {
        'slots': { },
        'utterances': [
            '{when\'s | when is} {collection | pick up | trash | garbage} day'
        ]
    },
    function(request, response) {
        return getCollectionDays(getAddress(request))
            .then(days => {
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
            });
    });

export = app;
