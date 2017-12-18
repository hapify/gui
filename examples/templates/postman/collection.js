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

//--------------------------------------------------
//  Methods
//--------------------------------------------------
function __defaultValue(f) {
    if (f.type === "boolean") return true;
    if (f.type === "string") return `Test ${f.names.wordsUpper}`;
    if (f.type === "number") return 2;
    if (f.type === "entity") return `{{${f.names.lowerCamel}Id}}`;
    return "null";
}

/**
 * Generate a read
 *
 * @param model
 * @private
 */
function __create(model) {

    const payload = model.fields.list.reduce((p, f) => {
        if (f.internal) return p;
        p[f.names.underscore] = __defaultValue(f);
        return p;
    }, {});

    const setVar = `    postman.setGlobalVariable("${model.names.lowerCamel}Id", jsonData._id);`;

    return {
        name: "Create",
        event: [
            {
                listen: "test",
                script: {
                    type: "text/javascript",
                    exec: [
                        "if (responseCode.code === 201) {",
                        "    var jsonData = JSON.parse(responseBody);",
                        setVar,
                        "}"
                    ]
                }
            }
        ],
        request: {
            url: `{{apiUrl}}/{{apiVersion}}/${model.names.hyphen}`,
            method: "POST",
            header: _headers,
            body: {
                mode: "raw",
                raw: JSON.stringify(payload, null, 2)
            },
            description: ""
        },
        response: []
    };
}

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
            __create(model),
            __read(model)
        ]
    };
}

//--------------------------------------------------
//  Output
//--------------------------------------------------
const _output = {
    variables: [],
    info: _infos,
    item: models.map(__model)
};

module.export = JSON.stringify(_output, null, 4);

