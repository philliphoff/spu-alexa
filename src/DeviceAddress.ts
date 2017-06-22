import * as alexa from 'alexa-app';
import * as debug from 'debug';
import * as request from 'request';

const spuAlexaDebug = debug('spu:alexa');

interface IDeviceAddress {
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    city: string;
    countryCode: string;
    districtOrCounty: string;
    stateOrRegion: string;
}

function getAddressForDeviceAsync(apiEndpoint: string, deviceId: string, consentToken: string): Promise<string> {
    const url = `${apiEndpoint}/v1/devices/${deviceId}/settings/address`;

    spuAlexaDebug('URL: %s', url);

    return new Promise((resolve, reject) => {
        request({
            headers: {
                'Authorization': `Bearer ${consentToken}`
            },
            method: 'GET',
            json: true,
            url,
        },
        (err, res, body: IDeviceAddress) => {
            if (err) {
                spuAlexaDebug('Error getting address: %O', err);
                return reject(err);
            }

            if (res.statusCode !== 200) {
                spuAlexaDebug('Received status code %d getting address.', res.statusCode);
                return reject(new Error(`Received status code ${res.statusCode} getting address.`));
            }

            spuAlexaDebug('Got address: %O', body);

            if (!body.addressLine1) {
                const message = 'Got an unexpected address.';
                spuAlexaDebug(message);
                return reject(new Error(message));
            }

            resolve(body.addressLine1);
        });
    });
}

export function getAddressForRequestAsync(request: alexa.IAlexaRequest): Promise<string> {
    const envAddress = process.env.SPU_ADDRESS;

    if (envAddress) {
        return Promise.resolve(envAddress);
    }
    
    spuAlexaDebug('Request: %O', request);

    if (request
        && request.context
        && request.context.System
        && request.context.System.apiEndpoint
        && request.context.System.user
        && request.context.System.user.permissions
        && request.context.System.device) {
        const apiEndpoint = request.context.System.apiEndpoint;
        const consentToken = request.context.System.user.permissions.consentToken;
        const deviceId = request.context.System.device.deviceId;

        spuAlexaDebug('API Endpoint: %s', apiEndpoint);
        spuAlexaDebug('ConsentToken: %s', consentToken);
        spuAlexaDebug('Device ID: %s', deviceId);

        if (apiEndpoint && consentToken && deviceId) {
            return getAddressForDeviceAsync(apiEndpoint, deviceId, consentToken);
        }
    }

    return Promise.reject(new Error('Unable to obtain an address.'));
}
