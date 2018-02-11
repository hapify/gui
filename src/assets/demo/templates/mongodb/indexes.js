
/**
 * Generate indexes for a model
 *
 * @param out
 * @param model
 * @private
 */
function __model(out, model) {

    const modelName = model.names.underscore;

    // Even if no fields have indexes, Include this collection
    // Get fields objects
    out[modelName] = model.fields.list.reduce((p, field) => {

        // Only if the field is searchable or sortable
        if (!field.sortable && !field.searchable) {
            return p;
        }

        const fieldName = field.names.underscore;
        const object = {
            fields: {
                [fieldName]: field.label ? 'text' : 1
            }
        };
        // If the field is unique
        if (field.unique) {
            object.options = {
                unique: true
            }
        }
        p[`${modelName}_${fieldName}`] = object;

        return p;
    }, {});

    return out;
}

//--------------------------------------------------
//  Output
//--------------------------------------------------
const _output = models.reduce(__model, {});
module.export = JSON.stringify(_output, null, 4);
