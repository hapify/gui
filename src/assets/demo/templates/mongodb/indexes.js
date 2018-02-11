
/**
 * Generate indexes for a model
 *
 * @param out
 * @param model
 * @private
 */
function __model(out, model) {

    const modelName = model.names.underscore;
    const labels = {};
    let hasLabels = false;

    // Even if no fields have indexes, Include this collection
    // Get fields objects
    out[modelName] = model.fields.list.reduce((p, field) => {

        // Only if the field is searchable or sortable
        if (!field.sortable && !field.searchable) {
            return p;
        }

        const fieldName = field.names.underscore;

        if (field.label) {
            labels[fieldName] = 'text';
            hasLabels = true;
            return p;
        }

        const object = {
            fields: {
                [fieldName]: 1
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

    if (hasLabels) {
        out[modelName][`${modelName}_labels`] = labels;
    }

    return out;
}

//--------------------------------------------------
//  Output
//--------------------------------------------------
const _output = models.reduce(__model, {});
module.export = JSON.stringify(_output, null, 4);
