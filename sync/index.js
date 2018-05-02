'use strict';

const MkDirP = require('mkdirp');
const Hapi = require('hapi');
const Config = require('./config');
const Fs = require('fs');
const Path = require('path');
const Boom = require('boom');
const Channels = require('./channels.json').channels;
const Token = require('./auth').token;
const Joi = require('joi');

const SchemaPayload = Joi.object({
    channel: Joi.string().regex(/^([a-f0-9-]+)$/i).required(),
    files: Joi.array().items(Joi.object({
        path: Joi.string().regex(/(\.\.)/, { invert: true }).required(),
        content: Joi.string().required()
    })).required()
});

(async () => {

    const server = new Hapi.Server(Config);
    
    const Routes = [
        {
            method: 'POST',
            path: '/files',
            options: { validate: { payload: SchemaPayload } },
            handler (request) {
                
                // Simple auth (not HapiJs style)
                if (typeof request.headers['x-hapify-token'] === 'undefined' ||
                    request.headers['x-hapify-token'] !== Token) {
                    return Boom.unauthorized('Token is missing or invalid');
                }

                // Get channel
                if (typeof Channels[request.payload.channel] === 'undefined') {
                    return Boom.notFound('Channel not found');
                }
                const channel = Channels[request.payload.channel];
                const root = channel.path;
                
                // Copy files
                for (let i = 0; i < request.payload.files.length; i++) {
                    const file = request.payload.files[i];
                    const path = `${root}/${file.path}`;
                    MkDirP.sync(Path.dirname(path));
                    Fs.writeFileSync(path, file.content);
                }
                
                return '';
            }
        }
    ];

    // Add routes
    await server.route(Routes);
    
    // Start server
    await server.start();
    server.log(['booting'], `Sync server initialized on port ${Config.port}`);
    
})();
