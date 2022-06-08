var MiscUtil = {
    deepCopy: obj => JSON.parse(JSON.stringify(obj)),
    hasProperty: (obj, prop) => !!obj ? Object.prototype.hasOwnProperty.call(obj, prop) : false
}

module.exports = MiscUtil