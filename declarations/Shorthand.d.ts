export = Shorthand;
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
declare class Shorthand {
    /**
     * @param {String|Object} config The configuration object for a shorthand.
     */
    constructor(config: string | any);
    isPresent: boolean;
    name: any;
    shortFor: any[];
    /**
     * Sets the prescense state of this shorthand to true, and goes through the
     * short for list to update the specified args manager.
     *
     * @param {ArgsManager} manager
     */
    handlePrescense(manager: ArgsManager): void;
    /**
     * Takes a raw configuration list of short for configurations and turns it
     * into a working configuration object.
     *
     * @param {Array<Array<String>|String>} raw The raw short for array.
     * @returns {Array<ShortForConfig>}
     */
    parseShortForArray(raw: Array<Array<string> | string>): Array<ShortForConfig>;
    /**
     * Removes all dashes "-" from the beginning of the specified string.
     *
     * @param {String} raw
     * @returns {String}
     */
    stripDashesPrefix(raw: string): string;
}
declare namespace Shorthand {
    export { ShortForConfig };
}
type ShortForConfig = {
    type: string;
    name: string;
    rawParam: string;
    value?: string | undefined;
};
//# sourceMappingURL=Shorthand.d.ts.map