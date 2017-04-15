import * as alexa from 'alexa-app';

export function getAddress(request: alexa.IAlexaRequest): string {
    // TODO: Look for device address in request.
    return process.env.SPU_ADDRESS;
}
