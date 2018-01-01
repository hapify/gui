//--------------------------------------------------
//  Commons
//--------------------------------------------------
const DAY = 1000 * 60 * 60 * 24;
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
    if (f.type === "string") return `${f.names.wordsUpper}`;
    if (f.type === "number") return 2;
    if (f.type === "datetime") return Date.now();
    if (f.type === "entity") return `{{${f.model.names.lowerCamel}Id}}`;
    return "null";
}
function __defaultUpdatedValue(f) {
    if (f.type === "boolean") return false;
    if (f.type === "string") return `New ${f.names.wordsUpper}`;
    if (f.type === "number") return 3;
    if (f.type === "datetime") return Date.now() + 15 * DAY;
    if (f.type === "entity") return `{{${f.model.names.lowerCamel}Id}}`;
    return "null";
}
function __defaultSearchValue(f) {
    if (f.type === "boolean") return "true";
    if (f.type === "string") return `${f.names.wordsUpper}`;
    if (f.type === "number") return 2;
    if (f.type === "entity") return `{{${f.model.names.lowerCamel}Id}}`;
    return "null";
}

/**
 * Generate a create
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
        name: `Create ${model.names.lowerCamel}`,
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
        name: `Read ${model.names.lowerCamel}`,
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
 * Generate a delete
 *
 * @param model
 * @private
 */
function __delete(model) {
    return {
        name: `Delete ${model.names.lowerCamel}`,
        request: {
            url: `{{apiUrl}}/{{apiVersion}}/${model.names.hyphen}/{{${model.names.lowerCamel}Id}}`,
            method: "DELETE",
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
 * Generate an update
 *
 * @param model
 * @private
 */
function __update(model) {

    const payload = model.fields.list.reduce((p, f) => {
        if (f.internal) return p;
        p[f.names.underscore] = __defaultUpdatedValue(f);
        return p;
    }, {});

    return {
        name: `Update ${model.names.lowerCamel}`,
        request: {
            url: `{{apiUrl}}/{{apiVersion}}/${model.names.hyphen}/{{${model.names.lowerCamel}Id}}`,
            method: "PATCH",
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
 * Generate a list
 *
 * @param model
 * @private
 */
function __list(model) {

    const query = [];
    model.fields.searchable.forEach((f) => {
        query.push({
            key: f.names.underscore,
            value:  __defaultSearchValue(f),
            equals: true,
            description: "",
            disabled: true
        });
        if (f.type === 'number') {
            query.push({
                key: `${f.names.underscore}__min`,
                value:  1,
                equals: true,
                description: "",
                disabled: true
            });
            query.push({
                key: `${f.names.underscore}__max`,
                value:  10,
                equals: true,
                description: "",
                disabled: true
            });
        }
        else if (f.type === 'datetime') {
            query.push({
                key: `${f.names.underscore}__min`,
                value:  Date.now() - DAY,
                equals: true,
                description: "",
                disabled: true
            });
            query.push({
                key: `${f.names.underscore}__max`,
                value:  Date.now() + DAY,
                equals: true,
                description: "",
                disabled: true
            });
        }
    });
    
    const pagination = [
        {
            key: "_page",
            value: "0",
            equals: true,
            description: ""
        },
        {
            key: "_limit",
            value: "10",
            equals: true,
            description: ""
        }
    ];

    const sorter = model.fields.sortable.length ? [
        {
            key: "_sort",
            value: model.fields.sortable[0].names.underscore,
            equals: true,
            description: "",
            disabled: true
        },
        {
            key: "_order",
            value: "asc",
            equals: true,
            description: "",
            disabled: true
        }
    ] : [];

    return {
        name: `List ${model.names.lowerCamel}`,
        request: {
            url: {
                raw: `{{apiUrl}}/{{apiVersion}}/${model.names.hyphen}?_page=0&_limit=10`,
                host: ["{{apiUrl}}"],
                path: [
                    "{{apiVersion}}",
                    model.names.hyphen
                ],
                query: query.concat(pagination).concat(sorter),
                variable: []
            },
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
            __read(model),
            __update(model),
            __delete(model),
            __list(model)
        ]
    };
}

/**
 * Returns static routes
 *
 * @return {[{}]}
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

//--------------------------------------------------
//  Output
//--------------------------------------------------
const _output = {
    variables: [],
    info: _infos,
    item: models.map(__model).concat(__static())
};

module.export = JSON.stringify(_output, null, 4);

