declare module 'alexa-app' {
    export interface IAlexaDevice {
        deviceId?: string;
    }

    export interface IAlexaUserPermissions {
        consentToken?: string;
    }

    export interface IAlexaUser {
        permissions: IAlexaUserPermissions;
        userId: string;
    }

    export interface IAlexaSystem {
        apiEndpoint: string;
        device: IAlexaDevice;
        user: IAlexaUser;
    }

    export interface IAlexaContext {
        System: IAlexaSystem;
    }

    export interface IAlexaRequest {
        context: IAlexaContext;
    }

    export interface IAlexaResponse {
        say(text: string): void;
    }

    export interface IAlexaSchema {
        slots: {};
        utterances: string[];
    }

    export interface IAlexaApp {
        intent(
            name: string,
            schema: IAlexaSchema,
            handler: (request: IAlexaRequest, response: IAlexaResponse) => void
        ): void;
    }

    export class app implements IAlexaApp {
        intent(name: string, schema: {}, handler: (request: IAlexaRequest, response: IAlexaResponse) => void): void;

        constructor(name: string);
    }
}
