import * as moment from 'moment';

import { getCollectionDaysAsync, getNextCollectionDay } from '../CollectionDays';
import { getAddressForRequestAsync } from '../DeviceAddress';
import IAlexaIntent from './IAlexaIntent';

export const intent: IAlexaIntent = {
    name: 'GetCollectionTypeIntent',
    schema: {
        slots: {},
        utterances: [
            'if recycling {is | is being | will be} {collected | picked up} this week'
        ]
    },
    handler: (request, response) => {
        return getAddressForRequestAsync(request)
            .then(address => getCollectionDaysAsync(address))
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
            });    }
};

export default intent;
