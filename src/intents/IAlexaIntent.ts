import * as alexa from 'alexa-app';

export interface IAlexaIntent {
    name: string;
    schema: alexa.IAlexaSchema;
    handler: (request: alexa.IAlexaRequest, response: alexa.IAlexaResponse) => void;
}

export default IAlexaIntent;
