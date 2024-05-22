
export function questionValidator(title, body, tags) {
    const errors = {};

    if (title.trim() === '' || title.length < 15) {
        errors.title = 'Title must be atleast 15 characters long.'
    }

    if (body.trim() === '' || body.length < 30) {
        errors.body = 'Question body must be atleast 30 characters long.'
    }

    if (!Array.isArray(tags) || tags.length === 0 || tags.length > 5) {
        errors.tags = '1-5 tags must be added.'
    }

    if (tags.some((t) => !/^[a-zA-Z0-9-]*$/.test(t))) {
        errors.tags = 'Tags must have alphanumeric characters only.'
    }

    if (tags.filter((t, index) => tags.indexOf(t) !== index).length > 0) {
        errors.tags = 'Duplicate Tags cannot be added'
    }

    if (tags.some((t) => t.length > 15)) {
        errors.tags = "A single tag can't have more than 15 characters ."
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}