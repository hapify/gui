
/**
 * Returns a default input value for a field
 *
 * @param {Object} f
 * @return {*}
 * @private
 */
function __defaultValue(f) {
    if (f.type === "boolean") return true;
    if (f.type === "string") return `${f.names.wordsUpper}`;
    if (f.type === "number") return 2;
    if (f.type === "datetime") return Date.now();
    if (f.type === "entity") return __randomId();
    return null;
}
/**
 * Returns a default input update value for a field
 *
 * @param {Object} f
 * @return {*}
 * @private
 */
function __defaultUpdatedValue(f) {
    if (f.type === "boolean") return false;
    if (f.type === "string") return `New ${f.names.wordsUpper}`;
    if (f.type === "number") return 3;
    if (f.type === "datetime") return Date.now() + 15 * DAY;
    if (f.type === "entity") return __randomId();
    return null;
}
/**
 * Returns a default input search type for a field
 *
 * @param {Object} f
 * @return {*}
 * @private
 */
function __searchType(f) {
    if (f.type === "boolean") return "boolean";
    if (f.type === "string") return "string";
    if (f.type === "number") return "number";
    if (f.type === "datetime") return "number";
    if (f.type === "entity") return "string";
    return "null";
}
/**
 * Returns a default output value for a field
 *
 * @param {Object} f
 * @param {Boolean} deep
 *  Get referenced entity ?
 * @return {*}
 * @private
 */
function __defaultOutputValue(f, deep) {
    if (f.primary) return __randomId();
    if (f.type === "boolean") return true;
    if (f.type === "string") return `${f.names.wordsUpper}`;
    if (f.type === "number") return 2;
    if (f.type === "datetime") return Date.now();
    if (f.type === "entity") return deep ? __output(f.model, false) : __randomId();
    return null;
}
/**
 * Convert an object to json with indent
 *
 * @param {Object} object
 * @param {number} indent
 * @return {String}
 * @private
 */
function __objectToJson(object, indent) {
    const prefix = ' '.repeat(indent);
    return JSON.stringify(object, null, 4)
        .split("\n")
        .map((l) => `${prefix}${l}`)
        .join("\n");
}
/**
 * Generate a random MongoId
 *
 * @returns {String}
 * @private
 */
function __randomId () {
    const r = () => ((Math.random()*0.8)+0.1).toString(16).substring(2);
    return `${r()}${r()}${r()}`.substring(0, 24);
}
/**
 * Generate the intro
 *
 * @param {Object} models
 * @return {String}
 * @private
 */
function __intro(models) {

    const modelsNames = models.map((m) => m.names.raw).join('`, `');

    return `FORMAT: 1A
HOST: http://dev.api.app-bootstrap.com/v1/

# HapiJs Bootstrap

HapiJs starter kit API. Describes endpoints for plugins \`session\`, \`alive\` and for models \`${modelsNames}\`.\n\n`;
}

/**
 * Generate an error 400
 *
 * @param {Object} model
 * @return {String}
 * @private
 */
function __error400(model) {

    const payload = __objectToJson({
        statusCode: 400,
        error: "Bad Request",
        message: "Errors details here"
    }, 12);
    let output = `+ Response 400 (application/json)\n\n`;
    output += "    Invalid input.\n\n";
    output += "    + Body\n\n";
    output += `${payload}\n\n`;

    return output;
}
/**
 * Generate an error 404
 *
 * @param {Object} model
 * @return {String}
 * @private
 */
function __error404(model) {

    const payload = __objectToJson({
        statusCode: 404,
        error: "Not found",
        message: `${model.names.wordsUpper} not found`
    }, 12);
    let output = `+ Response 404 (application/json)\n\n`;
    output += `    No ${model.names.wordsLower} with this id was found.\n\n`;
    output += "    + Body\n\n";
    output += `${payload}\n\n`;

    return output;
}
/**
 * Generate an error 409
 *
 * @param {Object} model
 * @return {String}
 * @private
 */
function __error409(model) {

    const payload = __objectToJson({
        statusCode: 409,
        error: "Conflict",
        message: "Duplicate key"
    }, 12);
    let output = `+ Response 409 (application/json)\n\n`;
    output += `    Another ${model.names.wordsLower} with this unique key exists.\n\n`;
    output += "    + Body\n\n";
    output += `${payload}\n\n`;

    return output;
}
/**
 * Generate an object to simulate model output
 *
 * @param {Object} model
 * @param {Boolean} deep
 * @return {Object}
 * @private
 */
function __output(model, deep) {

    const output = {};
    model.fields.list.forEach((f) => {
        if (f.isPrivate) return;
        output[f.names.raw] = __defaultOutputValue(f, deep);
    });
    
    return output;
}
/**
 * Generate a create doc
 *
 * @param {Object} model
 * @return {String}
 * @private
 */
function __create(model) {

    const inPayload = model.fields.list.reduce((p, f) => {
        if (f.internal) return p;
        p[f.names.underscore] = __defaultValue(f);
        return p;
    }, {});
    const input = __objectToJson(inPayload, 8);

    const outPayload = __output(model, true);
    const output = __objectToJson(outPayload, 8);

    let out = `### Create ${model.names.wordsLower} [POST]\n\n`;
    out += "+ Request (application/json)\n\n";
    out += `${input}\n\n`;
    out += "+ Response 201 (application/json)\n\n";
    out += `${output}\n\n`;
    out += __error400(model);
    if (model.fields.unique.length) {
        out += __error409(model);
    }

    return out;
}
/**
 * Generate a read doc
 *
 * @param {Object} model
 * @return {String}
 * @private
 */
function __read(model) {

    const outPayload = __output(model, true);
    const output = __objectToJson(outPayload, 8);

    let out = `### Read ${model.names.wordsLower} [GET /${model.names.hyphen}/{${model.names.underscore}_id}]\n\n`;
    out += "+ Parameters\n\n";
    out += `    + ${model.names.underscore}_id (string) - The id of the ${model.names.wordsLower}.\n\n`;
    out += "+ Request (application/json)\n\n";
    out += "+ Response 200 (application/json)\n\n";
    out += `${output}\n\n`;
    out += __error400(model);
    out += __error404(model);

    return out;
}

/**
 * Generate a delete doc
 *
 * @param {Object} model
 * @return {String}
 * @private
 */
function __delete(model) {

    let out = `### Delete ${model.names.wordsLower} [DELETE /${model.names.hyphen}/{${model.names.underscore}_id}]\n\n`;
    out += "+ Parameters\n\n";
    out += `    + ${model.names.underscore}_id (string) - The id of the ${model.names.wordsLower}.\n\n`;
    out += "+ Request (application/json)\n\n";
    out += "+ Response 204 (application/json)\n\n";
    out += __error400(model);
    out += __error404(model);

    return out;
}

/**
 * Generate an update doc
 *
 * @param {Object} model
 * @return {String}
 * @private
 */
function __update(model) {

    const inPayload = model.fields.list.reduce((p, f) => {
        if (f.internal) return p;
        p[f.names.underscore] = __defaultUpdatedValue(f);
        return p;
    }, {});
    const input = __objectToJson(inPayload, 8);

    let out = `### Update ${model.names.wordsLower} [PATCH /${model.names.hyphen}/{${model.names.underscore}_id}]\n\n`;
    out += "+ Request (application/json)\n\n";
    out += `${input}\n\n`;
    out += "+ Response 204 (application/json)\n\n";
    out += __error400(model);
    out += __error404(model);
    if (model.fields.unique.length) {
        out += __error409(model);
    }

    return out;
}
/**
 * Generate a list doc
 *
 * @param {Object} model
 * @return {String}
 * @private
 */
function __list(model) {

    const query = [];
    model.fields.searchable.forEach((f) => {
        query.push({
            key: f.names.underscore,
            type:  __searchType(f),
            required: false,
            description: `Value for ${f.names.wordsLower}.`
        });
        if (f.type === 'number') {
            query.push({
                key: `${f.names.underscore}__min`,
                type:  'number',
                required: false,
                description: `Minimum value for ${f.names.wordsLower}.`
            });
            query.push({
                key: `${f.names.underscore}__max`,
                type:  'number',
                required: false,
                description: `Maximum value for ${f.names.wordsLower}.`
            });
        }
        else if (f.type === 'datetime') {
            query.push({
                key: `${f.names.underscore}__min`,
                type:  'number',
                required: false,
                description: `Minimum value for ${f.names.wordsLower}.`
            });
            query.push({
                key: `${f.names.underscore}__max`,
                type:  'number',
                required: false,
                description: `Maximum value for ${f.names.wordsLower}.`
            });
        }
    });

    const pagination = [
        {
            key: "_page",
            type:  'number',
            required: true,
            description: "Page number. Greater or equal than 0."
        },
        {
            key: "_limit",
            type:  'number',
            required: true,
            description: "Required results length. Greater or equal than 1. Lower or equal than 100."
        }
    ];

    const sortables = model.fields.sortable.map((f) => f.names.underscore.replace('_', ' ')).join('`, `');
    const sorter = model.fields.sortable.length ? [
        {
            key: "_sort",
            type:  'string',
            required: false,
            description: `Required sort. Can be \`${sortables}\`.`
        },
        {
            key: "_order",
            type:  'string',
            required: false,
            description: "Required sort order. Can be `asc` or `desc`."
        }
    ] : [];

    const params = query.concat(pagination).concat(sorter);
    const paramsList = params.map(p => p.key).join(',');

    const outPayload = __output(model, false);
    const output = __objectToJson({
        page: 0,
        limit: 10,
        count: 10,
        total: 32,
        items: [outPayload]
    }, 8);

    let out = `### List ${model.names.wordsLower} [GET /${model.names.hyphen}{?${paramsList}}]\n\n`;
    out += "+ Parameters\n\n";
    params.forEach((p) => {
        out += `    + ${p.key} (${p.required ? '' : 'optional, '}${p.type}) - ${p.description}\n`;
    });
    out += "\n";
    out += "+ Request (application/json)\n\n";
    out += "+ Response 200 (application/json)\n\n";
    out += `${output}\n\n`;
    out += __error400(model);

    return out;
}

/**
 * Generate a model
 *
 * @param {Object} model
 * @return {String}
 * @private
 */
function __model(model) {

    let out = `## ${model.names.wordsUpper} [/${model.names.hyphen}]\n\n`;
    out += __create(model);
    out += __read(model);
    out += __update(model);
    out += __delete(model);
    out += __list(model);

    return out;
}

/**
 * Returns static routes doc
 *
 * @return {String}
 * @private
 */
function __static() {
    return [
        {
            name: "Misc",
            description: "",
            item: [
                {
                    name: 'Alive',
                    request: {
                        url: `{{apiUrl}}/alive`,
                        method: "GET",
                        header: _headers,
                        body: {
                            mode: "raw",
                            raw: ""
                        },
                        description: ""
                    },
                    response: []
                }
            ]
        },
        {
            name: "Session",
            description: "",
            item: [
                {
                    name: 'Login',
                    event: [
                        {
                            listen: "test",
                            script: {
                                type: "text/javascript",
                                exec: [
                                    "if (responseCode.code === 201) {",
                                    "    var jsonData = JSON.parse(responseBody);",
                                    "    postman.setGlobalVariable(\"userId\", jsonData._id);",
                                    "}"
                                ]
                            }
                        }
                    ],
                    request: {
                        url: `{{apiUrl}}/{{apiVersion}}/session`,
                        method: "POST",
                        header: _headers,
                        body: {
                            mode: "raw",
                            raw: JSON.stringify({
                                email: 'test@mail.com',
                                password: 'passtest'
                            }, null, 2)
                        },
                        description: ""
                    },
                    response: []
                },
                {
                    name: 'Logout',
                    request: {
                        url: `{{apiUrl}}/{{apiVersion}}/session`,
                        method: "DELETE",
                        header: _headers,
                        body: {
                            mode: "raw",
                            raw: ""
                        },
                        description: ""
                    },
                    response: []
                },
                {
                    name: 'Current',
                    event: [
                        {
                            listen: "test",
                            script: {
                                type: "text/javascript",
                                exec: [
                                    "if (responseCode.code === 200) {",
                                    "    var jsonData = JSON.parse(responseBody);",
                                    "    postman.setGlobalVariable(\"userId\", jsonData._id);",
                                    "}"
                                ]
                            }
                        }
                    ],
                    request: {
                        url: `{{apiUrl}}/{{apiVersion}}/session`,
                        method: "GET",
                        header: _headers,
                        body: {
                            mode: "raw",
                            raw: ""
                        },
                        description: ""
                    },
                    response: []
                },
            ]
        }
    ];
}


let ouput = __intro(models);
ouput += models.map(__model).join("\n\n");

module.export = ouput;

