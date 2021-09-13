/**
 * Returns an object that consist only from allowed properties
 * @param {Object} collection
 * @param {Array<String>} allowedProps
 *
 * @returns {Promise<Array<ServiceInfo>>}
 */
function extractAllowedProperties(collection, allowedProps) {
    if (!collection || typeof collection !== 'object') {
        throw new Error('Collection must be an object.')
    }
    return Object.fromEntries(
        Object.entries(collection)
            .filter(([key]) => allowedProps.includes(key))
    )
}

export { extractAllowedProperties }