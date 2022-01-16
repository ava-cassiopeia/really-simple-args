export = ArgsManager;
/**
 * Class for managing and reporting arguments.
 *
 * @class
 */
declare class ArgsManager {
    constructor(shorthands?: any[], argsArray?: any);
    shorthands: Shorthand[];
    argsArray: any;
    flags: {};
    parameters: {};
    floatingArgs: any[];
    /**
     * Parses a shorthands configuration object and returns a valid array
     * of shorthands.
     *
     * @param {Array<Object>} rawShorthands The shorthands configuration
     *  array.
     * @returns {Array<Shorthand>}
     */
    parseShorthands(rawShorthands: Array<any>): Array<Shorthand>;
    /**
     * Sorts the raw args into flags and arguments.
     */
    sort(): void;
    /**
     * Retrieves an argument by it's index. An argument's index is
     * determined assuming that no flags, starting parameters, or
     * parameters are present.
     *
     * @param {Integer} index the index of the argument to retrieve.
     *
     * @return {String} the value of the argument at the given index, or
     *  undefined if nothing was at the specified index.
     */
    getArgumentByIndex(index: Integer): string;
    /**
     * Gets the amount of arguments available, where an argument is anything
     * that isn't a parameter or a flag that was passed to the command.
     */
    getAmountOfArguments(): number;
    /**
     * Returns true if a flag with the specified name is present. A flag is an
     * argument with "--" in the front of it.
     *
     * @param {String} name the name of the flag, without the "--" at the front
     *
     * @returns {Boolean} true if the flag is present, or false otherwise
     */
    hasFlag(name: string): boolean;
    /**
     * Returns true if a parameter with the specified name is present. A
     * parameter is an argument that has "-" in front of it, and is preceded
     * by a value.
     *
     * @param {String} name the name of the parameter, without the "-" at
     *  the front
     *
     * @returns {Boolean} true if the parameter is present, or false
     *  otherwise
     */
    hasParameter(name: string): boolean;
    /**
     * Returns true if the specified shorthand is present (without the "-"
     * at the beginning of the shorthand).
     *
     * @param {String} name
     * @returns {Boolean}
     */
    shorthandIsPresent(name: string): boolean;
    /**
     * Gets the value of the specified parameter, assuming the parameter exists.
     *
     * @param {String} name the name of the parameter, without the "-" at the
     * front
     *
     * @returns {String|null} will return null if the parameter does not exist,
     * otherwise returns the string value of the parameter as specified in the
     * args.
     */
    getParameter(name: string): string | null;
    /**
     * Takes the raw flag string and performs the nessesary steps to add it to
     * the managed list of flags, including checking for duplicate flags.
     *
     * @param {String} arg the raw string argument that is considered a flag.
     * Does not check the validity of the flag.
     */
    handleFlag(arg: string): void;
    /**
     * Takes the raw argument string and performs the nessesary steps to add it
     * to the arguments list, including checking for duplicates and gathering
     * a value.
     *
     * @param {String} arg the raw string argument that is considered a
     * Parameter. Will not check the validity of the Parameter
     *
     * @param {Integer} index the index in the arguments array that the arg
     * param is located at; used to look forward for the value
     *
     * @param {String=} overrideValue Optional value to replace the one that
     *  this method automatically looks up from the args array.
     */
    handleParameter(arg: string, index: Integer, overrideValue?: string | undefined): void;
    /**
     * Takes the raw shorthand, and transforms it into its handled
     * shorthands. Must take a valid shorthand.
     *
     * @param {String} arg
     */
    handleShorthand(arg: string): void;
    /**
     * Determines whether the specified string is a Parameter.
     *
     * @param {String} arg the argument to be checked
     *
     * @returns {Boolean} true if the arg is a Parameter, false otherwise
     */
    isParameter(arg: string): boolean;
    /**
     * Determines whether the specified string is a Flag.
     *
     * @param {String} arg the argument to be checked
     *
     * @returns {Boolean} true if the arg is a Flag, false otherwise
     */
    isFlag(arg: string): boolean;
    /**
     * Determines whether the specified string is a Shorthand.
     *
     * @param {String} arg The argument to be checked
     * @returns {Boolean} True if the argument is a valid Shorthand, false
     *  otherwise.
     */
    isShorthand(arg: string): boolean;
    /**
     * Determines whether the specified shorthand has been registered.
     *
     * @param {String} name
     * @returns {Boolean}
     */
    hasShorthand(name: string): boolean;
}
import Shorthand = require("./Shorthand");
//# sourceMappingURL=ArgsManager.d.ts.map