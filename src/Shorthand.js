class Shorthand {

    /**
     * @param {String|Object} config The configuration object for a shorthand.
     */
    constructor(config) {
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
     * Takes a raw configuration list of short for configurations and turns it
     * into a working configuration object.
     * 
     * @param {Array<Array<String>|String>} raw The raw short for array.
     * @returns {Array<Object>}
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
                    value: null
                };
            } else {
                output[x] = {
                    type: "parameter",
                    name: this.stripDashesPrefix(curr[0]),
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