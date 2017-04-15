import * as alexa from 'alexa-app';

import getCollectionDayIntent from './intents/GetCollectionDayIntent';
import getCollectionTypeIntent from './intents/GetCollectionTypeIntent';

const app = new alexa.app('spu');

app.intent(
    getCollectionDayIntent.name,
    getCollectionDayIntent.schema,
    getCollectionDayIntent.handler);

app.intent(
    getCollectionTypeIntent.name,
    getCollectionTypeIntent.schema,
    getCollectionTypeIntent.handler);

export = app;
