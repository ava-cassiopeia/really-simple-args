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
            const cases = ["-f", "-foobar", "-foo-bar"];

            cases.forEach((value, index) => {
                assert.equal(args.isParameter(value), true, `Did not return true for ${value}`);
            });
        });

        it("should return false for invalid parameters", function() {
            const cases = ["a", "a-b", "--a", "--foobar"];

            cases.forEach((value, index) => {
                assert.equal(args.isParameter(value), false, `Did not return false for ${value}`);
            });
        });
    });
});