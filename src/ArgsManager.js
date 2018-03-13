const Shorthand = require("./Shorthand");

/**
 * Class for managing and reporting arguments.
 * 
 * @class
 */
class ArgsManager {
    
        constructor(shorthands = [], argsArray = process.argv) {
            this.shorthands = this.parseShorthands(shorthands);
            this.argsArray = argsArray;
            this.flags = {};
            this.parameters = {};
            this.floatingArgs = [];
    
            this.sort();
        }

        /**
         * Parses a shorthands configuration object and returns a valid array
         * of shorthands.
         * 
         * @param {Array<Object>} rawShorthands The shorthands configuration
         *  array.
         * @returns {Array<Shorthand>}
         */
        parseShorthands(rawShorthands) {
            let output = [];
            let shorthand = null;
            let sho = null;

            for(let x = 0; x < rawShorthands.length; x++) {
                shorthand = rawShorthands[x];
                sho = new Shorthand(shorthand);

                if(output[sho.name]) {
                    throw new Error(`The shorthand ${sho.name} has already been registered. You cannot register multiple shorthands with the same name.`);
                }

                output[sho.name] = sho;
            }

            return output;
        }
    
        /**
         * Sorts the raw args into flags and arguments.
         */
        sort() {
            // we start x at 2 because the first two arguments are always node 
            // and the command itself
            for(let x = 2; x < this.argsArray.length; x++) {
                const arg = this.argsArray[x];
    
                if(this.isFlag(arg)) {
                    this.handleFlag(arg);
                } else if(this.isShorthand(arg)) {
                    this.handleShorthand(arg);
                } else if(this.isParameter(arg)) {
                    this.handleParameter(arg, x);
    
                    // It is assumed that the argument value follows the argument
                    // itself, so we skip it.
                    x += 1;
                } else if(arg.trim() !== '') {
                    this.floatingArgs.push(arg);
                }
            }
        }

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
        getArgumentByIndex(index) {
            return this.floatingArgs[index];
        }

        /**
         * Gets the amount of arguments available, where an argument is anything
         * that isn't a parameter or a flag that was passed to the command.
         */
        getAmountOfArguments() {
            return this.floatingArgs.length;
        }
    
        /**
         * Returns true if a flag with the specified name is present. A flag is an
         * argument with "--" in the front of it.
         *
         * @param {String} name the name of the flag, without the "--" at the front
         *
         * @returns {Boolean} true if the flag is present, or false otherwise
         */
        hasFlag(name) {
            return typeof this.flags[name] !== 'undefined' && this.flags[name];
        }
    
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
        hasParameter(name) {
            return typeof this.parameters[name] !== 'undefined'
                && this.parameters[name] != null;
        }

        /**
         * Returns true if the specified shorthand is present (without the "-"
         * at the beginning of the shorthand).
         * 
         * @param {String} name
         * @returns {Boolean}
         */
        shorthandIsPresent(name) {
            if(name.length !== 1) {
                throw new Error(`${name} is an invalid shorthand. Shorthands can only be one character long.`);
            }

            if(!this.hasShorthand(name)) {
                throw new Error(`${name} is not a valid shorthand. You must register shorthands ahead of time.`);
            }

            /**
             * @type {Shorthand}
             */
            const shorthand = this.shorthands[name];

            return shorthand.isPresent;
        }
    
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
        getParameter(name) {
            if(!this.hasParameter(name)) {
                return null;
            }
    
            return this.parameters[name];
        }
    
        /**
         * Takes the raw flag string and performs the nessesary steps to add it to
         * the managed list of flags, including checking for duplicate flags.
         *
         * @param {String} arg the raw string argument that is considered a flag.
         * Does not check the validity of the flag.
         */
        handleFlag(arg) {
            const name = arg.replace(/^--/, "");
    
            if(this.flags[name]) {
                throw new Error(`The flag ${name} has already been specified.`);
            }
    
            this.flags[name] = true;
        }
    
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
        handleParameter(arg, index, overrideValue = null) {
            const name = arg.replace(/^-/, "");
            const value = overrideValue || this.argsArray[index + 1];
    
            if(!value) {
                throw new Error(`The argument ${name} has no value.`);
            }
    
            if(this.parameters[name]) {
                throw new Error(`The argument ${name} has already been specified.`);
            }
    
            this.parameters[name] = value;
        }

        /**
         * Takes the raw shorthand, and transforms it into its handled
         * shorthands. Must take a valid shorthand.
         * 
         * @param {String} arg
         */
        handleShorthand(arg) {
            arg = arg.replace(new RegExp("^-"), "");

            let char = null;
            /**
             * @type {Shorthand}
             */
            let shorthand = null;

            for(let x = 0; x < arg.length; x++) {
                char = arg[x];
                shorthand = this.shorthands[char];

                shorthand.handlePrescense(this);
            }
        }
    
        /**
         * Determines whether the specified string is a Parameter.
         *
         * @param {String} arg the argument to be checked
         *
         * @returns {Boolean} true if the arg is a Parameter, false otherwise
         */
        isParameter(arg) {
            return !!arg.match(/^-[(:?a-z)]{1}[(:?a-z)|-]*$/g);
        }
    
        /**
         * Determines whether the specified string is a Flag.
         *
         * @param {String} arg the argument to be checked
         *
         * @returns {Boolean} true if the arg is a Flag, false otherwise
         */
        isFlag(arg) {
            return !!arg.match(/^--[(a-z)|-]*$/g);
        }

        /**
         * Determines whether the specified string is a Shorthand.
         * 
         * @param {String} arg The argument to be checked
         * @returns {Boolean} True if the argument is a valid Shorthand, false
         *  otherwise.
         */
        isShorthand(arg) {
            // First, we need to validate that this is a valid shorthand
            // syntax-wise. Shorthands are equivalent in syntax to parameters,
            // so we can just use that method.
            if(!this.isParameter(arg)) {
                return false;
            }

            // If we got this far, we should strip off the trailing "-".
            arg = arg.replace(new RegExp("^-"), "");

            // If the arg is exactly one character, then it's either just one 
            // shorthand, or not a shorthand. So, loop through all known
            // shorthands to see if we have a match.
            if(arg.length == 1) {
                return this.hasShorthand(arg);
            }

            // Finally, if the argument is more than 1 character long, it may be
            // multiple shorthands stacked together. In this case, try to find
            // a valid shorthand for _every_ character. If this does not succeed
            // it is not a shorthand.
            let char = null;

            for(let x = 0; x < arg.length; x++) {
                char = arg[x];

                if(!this.hasShorthand(char)) {
                    return false;
                }
            }

            return true;
        }

        /**
         * Determines whether the specified shorthand has been registered.
         * 
         * @param {String} name
         * @returns {Boolean}
         */
        hasShorthand(name) {
            if(name.length !== 1) {
                throw new Error(`${name} is not a valid shorthand as it is not 1 character.`);
            }

            return !!this.shorthands[name];
        }
    
    }
    
    module.exports = ArgsManager;