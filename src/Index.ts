import * as alexa from 'alexa-app';

import IAlexaIntent from './intents/IAlexaIntent';
import getCollectionDayIntent from './intents/GetCollectionDayIntent';
import getCollectionTypeIntent from './intents/GetCollectionTypeIntent';

const app = new alexa.app('spu');

function registerIntents(intents: IAlexaIntent[]): void {
    intents.forEach(intent => {
        app.intent(intent.name, intent.schema, intent.handler);
    });
}

registerIntents([
        getCollectionDayIntent,
        getCollectionTypeIntent
    ]);

export = app;
