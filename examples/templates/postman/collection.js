//--------------------------------------------------
//  Commons
//--------------------------------------------------
const _headers = [
    {
        key: "Accept",
        value: "application/json",
        description: ""
    },
    {
        key: "Content-Type",
        value: "application/json",
        description: ""
    }
];
const _infos = {
    name: "Project",
    description: "",
    schema: "https://schema.getpostman.com/json/collection/v2.0.0/collection.json"
};

/**
 * Generate a read
 *
 * @param model
 * @private
 */
function __read(model) {
    return {
        name: "Read",
        request: {
            url: `{{apiUrl}}/{{apiVersion}}/${model.names.hyphen}/{{${model.names.lowerCamel}Id}}`,
            method: "GET",
            header: _headers,
            body: {
                mode: "raw",
                raw: ""
            },
            description: ""
        },
        response: []
    };
}

/**
 * Generate a model
 *
 * @param model
 * @private
 */
function __model(model) {
    return {
        name: model.names.wordsUpper,
        description: "",
        item: [
            __read(model)
        ]
    };
}

const _output = {
    variables: [],
    info: _infos,
    item: models.map(__model)
};

exports = JSON.stringify(_output, null, 4);

