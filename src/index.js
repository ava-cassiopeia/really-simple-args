const ArgsManager = require("./ArgsManager.js");

module.exports = function(shorthands = []) {
    return new ArgsManager(shorthands);
};
