function getErrorMessages(validationError) {
    let errors = []

    const { details, message } = validationError

    if (!details) {
        errors.push(message)
        return errors
    }

    for (let { message } of details) {
        errors.push(message)
    }

    return errors
}

function createObjectIdError(field) {
    return new Error(`Specify a valid ID for field "${field}".`)
}

module.exports.getErrorMessages = getErrorMessages
module.exports.createObjectIdError = createObjectIdError