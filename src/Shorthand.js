/// <reference path="ArgsManager.js" />

/**
 * @typedef {Object} ShortForConfig
 * @prop {String} type
 * @prop {String} name
 * @prop {String} rawParam
 * @prop {String=} value
 */

/**
 * Class representing an existing shorthand argument.
 * 
 * @class
 */
class Shorthand {

    /**
     * @param {String|Object} config The configuration object for a shorthand.
     */
    constructor(config) {
        this.isPresent = false;

        if(typeof config === "string") {
            this.name = config;
            this.shortFor = [];
        } else {
            this.name = config.name;
            this.shortFor = this.parseShortForArray(config.shortFor || []);
        }

        if(this.name.length !== 1) {
            throw new Error(`Shorthand names cannot be longer than one character. Bad shorthand: ${this.name}`);
        }
    }

    /**
     * Sets the prescense state of this shorthand to true, and goes through the
     * short for list to update the specified args manager.
     * 
     * @param {ArgsManager} manager
     */
    handlePrescense(manager) {
        this.isPresent = true;

        this.shortFor.forEach((config, index) => {
            switch(config.type) {
                case "flag":
                    manager.handleFlag(config.rawParam);
                    break;
                case "parameter":
                    manager.handleParameter(config.rawParam, -2, config.value);
                    break;
                default:
                    throw new Error(`Unknown short for config type: ${config.type}`);
            }
        });
    }

    /**
     * Takes a raw configuration list of short for configurations and turns it
     * into a working configuration object.
     * 
     * @param {Array<Array<String>|String>} raw The raw short for array.
     * @returns {Array<ShortForConfig>}
     */
    parseShortForArray(raw) {
        let output = [];
        let curr = null;

        for(let x = 0; x < raw.length; x++) {
            curr = raw[x];

            if(typeof curr === "string") {
                output[x] = {
                    type: "flag",
                    name: this.stripDashesPrefix(curr),
                    rawParam: curr,
                    value: null
                };
            } else {
                output[x] = {
                    type: "parameter",
                    name: this.stripDashesPrefix(curr[0]),
                    rawParam: curr[0],
                    value: curr[1]
                };
            }
        }

        return output;
    }

    /**
     * Removes all dashes "-" from the beginning of the specified string.
     * 
     * @param {String} raw
     * @returns {String}
     */
    stripDashesPrefix(raw) {
        return raw.replace(new RegExp("^[-]*", ["g"]), "");
    }

}

module.exports = Shorthand;