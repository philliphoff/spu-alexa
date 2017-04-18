import * as alexa from 'alexa-app';
import * as request from 'request';

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
    return new Promise((resolve, reject) => {
        request({
            headers: {
                'Authorization': `Bearer ${consentToken}`
            },
            method: 'GET',
            json: true,
            url: `${apiEndpoint}/v1/devices/${deviceId}/settings/address`,
        },
        (err, res, body: IDeviceAddress) => {
            if (err) {
                return reject(err);
            }

            if (res.statusCode !== 200) {
                return reject(new Error('Unable to obtain an address for the device.'));
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

    const apiEndpoint = request.context.System.apiEndpoint;
    const consentToken = request.context.System.user.permissions.consentToken;
    const deviceId = request.context.System.device.deviceId;

    if (consentToken && deviceId) {
        return getAddressForDeviceAsync(apiEndpoint, deviceId, consentToken);
    }

    return Promise.reject(new Error('Unable to obtain an address.'));
}
