const assert = require("assert");
const ArgsManager = require("./../src/ArgsManager");
const Shorthand = require("./../src/Shorthand");

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

    describe(".isShorthand()", function() {
        const sargs = new ArgsManager([
            "a",
            "b",
            {
                name: "c",
                shortFor: [
                    "--foo",
                    "--bar",
                    ["-d", "testing"]
                ]
            }
        ], []);

        it("should return true for valid shorthands", function() {
            const cases = ["-a", "-b", "-c", "-ab", "-ac", "-bc", "-abc"];

            cases.forEach((value, index) => {
                assert.equal(sargs.isShorthand(value), true, `Did not return true for shorthand ${value}`);
            });
        });

        it("should return false for invalid shorthands", function() {
            const cases = ["-d", "-abe", "-fa", "--a", "--b--a"];

            cases.forEach((value, index) => {
                assert.equal(sargs.isShorthand(value), false, `Did not return false for shorthand ${value}`);
            });
        });
    });
});

describe("Shorthand", function() {
    describe("constructor()", function() {
        it("should have a name that matches the string it was constructed from when constructed from a string", function() {
            const sh = new Shorthand("a");

            assert.equal(sh.name, "a");
        });

        it("should have an empty shortFor value when constructed from a string", function() {
            const sh = new Shorthand("b");

            assert.notEqual(typeof sh.shortFor, "undefined");
            assert.equal(typeof sh.shortFor.length, "number");
            assert.equal(sh.shortFor.length, 0);
        });

        it("should have a name that matches the name specified in the configuration object", function() {
            const sh = new Shorthand({name: "c", shortFor: []});

            assert.equal(sh.name, "c");
        });

        it("should throw an error if the shorthand's name is longer than 1 character", function() {
            assert.throws(() => {
                new Shorthand("foobar");
            });

            assert.throws(() => {
                new Shorthand({name: "foobaz", shortFor: []});
            });
        });

        it("should throw an error if the shorthand's name is shorter than 1 character", function() {
            assert.throws(() => {
                new Shorthand("");
            });

            assert.throws(() => {
                new Shorthand({name: "", shortFor: []});
            });
        });
    });

    describe(".stripDashesPrefix()", function() {
        const sh = new Shorthand("a");

        it("Should remove all dashes from the beginning of a given string", function() {
            const cases = [
                ["--foobar", "foobar"],
                ["-foobar", "foobar"],
                ["-f", "f"],
                ["--f", "f"],
                ["-foo-bar", "foo-bar"],
                ["--foo--bar", "foo--bar"]
            ];

            cases.forEach((value, index) => {
                assert.equal(sh.stripDashesPrefix(value[0]), value[1]);
            });
        });
    });
});