import * as alexa from 'alexa-app';
import * as moment from 'moment';
import * as spu from 'spu-api';

const app = new alexa.app('spu');

function getAddress(request: alexa.IAlexaRequest): string {
    // TODO: Look for device address in request.
    return process.env.SPU_ADDRESS;
}

function getCollectionDaysAsync(address: string): Promise<spu.ICollectionDay[]> {
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

function getNextCollectionDay(days: spu.ICollectionDay[]): spu.ICollectionDay {
    const sortedDays = [...days].sort((a, b) => a.date.valueOf() - b.date.valueOf()); 
                
    const now = new Date();

    const futureDays = sortedDays.filter(day => day.date.valueOf() >= now.valueOf());

    if (futureDays.length) {
        return futureDays[0];
    }

    return undefined;
}

app.intent(
    'GetCollectionDayIntent',
    {
        slots: { },
        utterances: [
            '{when\'s | when is} {collection | pick up | trash | garbage} day'
        ]
    },
    function(request, response) {
        return getCollectionDaysAsync(getAddress(request))
            .then(days => {
                const day = getNextCollectionDay(days);

                if (day) {
                    const date = moment(day.date);
                    response.say(`Your next collection day is ${date.format('dddd')}.`);
                }
                else {
                    response.say('Sorry, but I could not find any future collection days.');
                }
            });
    });

app.intent(
    'GetCollectionTypeIntent',
    {
        slots: {},
        utterances: [
            'if recycling {is | is being | will be} {collected | picked up} this week'
        ]
    },
    function(request, response) {
        return getCollectionDaysAsync(getAddress(request))
            .then(days => {
                const day = getNextCollectionDay(days);

                if (day) {
                    const date = moment(day.date);

                    if (day.recycling) {
                        response.say(`Yes, recycling will be picked up on ${date.format('dddd')}.`);
                    }
                    else {
                        response.say(`No, recycling will not be picked up on ${date.format('dddd')}.`);
                    }
                }
                else {
                    response.say('Sorry, but I could not find any future collection days.');
                }
            });
    });

export = app;
