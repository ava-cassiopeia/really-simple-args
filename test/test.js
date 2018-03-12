const assert = require("assert");
const ArgsManager = require("./../src/ArgsManager");

describe("ArgsManager", function() {
    const args = new ArgsManager([]);

    describe(".isFlag()", function() {
        it("should return true for valid flags (--flagname)", function() {
            assert.equal(args.isFlag("--foobar"), true);
            assert.equal(args.isFlag("--a"), true);
            assert.equal(args.isFlag("--foo-bar"), true);
        });

        it("should return false for invalid flags", function() {
            assert.equal(args.isFlag("-foobar"), false);
            assert.equal(args.isFlag("-a"), false);
            assert.equal(args.isFlag("-a--b"), false);
            assert.equal(args.isFlag("-a-b"), false);
            assert.equal(args.isFlag("foobar"), false);
            assert.equal(args.isFlag("a"), false);
        });
    });

    describe(".isParameter()", function() {
        it("should return true for valid parameters (-param-name)", function() {
            assert.equal(args.isParameter("-f"), true);
            assert.equal(args.isParameter("-foobar"), true);
            assert.equal(args.isParameter("-foo-bar"), true);
        });

        it("should return false for invalid parameters", function() {
            assert.equal(args.isParameter("a"), false);
            assert.equal(args.isParameter("a-b"), false);
            assert.equal(args.isParameter("--a"), false);
            assert.equal(args.isParameter("--foobar"),false);
        });
    });
});