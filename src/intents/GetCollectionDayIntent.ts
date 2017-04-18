import * as moment from 'moment';

import { getCollectionDaysAsync, getNextCollectionDay } from '../CollectionDays';
import { getAddressForRequestAsync } from '../DeviceAddress';
import IAlexaIntent from './IAlexaIntent';

export const intent: IAlexaIntent = {
    name: 'GetCollectionDayIntent',
    schema: {
        slots: { },
        utterances: [
            '{when\'s | when is} {collection | pick up | trash | garbage} day'
        ]
    },
    handler: (request, response) => {
        return getAddressForRequestAsync(request)
            .then(address => getCollectionDaysAsync(address))
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
    }
}

export default intent;
