'use strict';

module.exports = {
    port: 9080,
    address: '127.0.0.1',
    routes: {
        response: { emptyStatusCode: 204 },
        timeout: {
            server: 5000 * 10,
            socket: 5000 * 10 + 1
        },
        cors: {
            credentials: true,
            origin: ['127.0.0.1'],
            additionalHeaders: ['X-Hapify-Token']
        }
    },
    debug: {
        request: ['error'],
        log: ['error']
    },
    load: { sampleInterval: 1000 * 2 }
};
