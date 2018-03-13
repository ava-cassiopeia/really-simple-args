# Really Simple Args

[![npm version](https://badge.fury.io/js/really-simple-args.svg)](https://badge.fury.io/js/really-simple-args)
[![Build Status](https://travis-ci.org/aeolingamenfel/really-simple-args.svg?branch=master)](https://travis-ci.org/aeolingamenfel/really-simple-args)

NPM/Node CommonJS module for automatically sorting and managing command-line 
arguments for your command line tool.

---

  - [Installation](#installation)
  - [Simple Usage](#simple-usage)
  - [Concepts](#concepts)
  - [Usage](#usage)
    - [Register Shorthands](#register-shorthands)
    - [Get Argument by Index](#get-argument-by-index)
    - [Get Amount of Arguments](#get-amount-of-arguments)
    - [Determine if Flag Exists](#determine-if-flag-exists)
    - [Determine if Parameter Exists](#determine-if-parameter-exists)
    - [Get Parameter Value](#get-parameter-value)
    - [Determine if Shorthand Exists](#determine-if-shorthand-exists)
    - [Determine if Shorthand is Being Used](#determine-if-shorthand-is-being-used)

## Installation

To install, simply run:

```CLI
npm i --save really-simple-args
```

## Simple Usage

Below is a simple example of what you can do with this code. See the 
[usage section](#usage) for more information.

```Javascript
const args = require("really-simple-args")();

if(args.hasFlag("my-flag")) {
    // do something when --my-flag is passed
}

if(args.hasParameter("p")) {
    const pValue = args.getParameter("p");

    // do something with pValue, which was passed with -p
}
```

## Concepts

This repository, and by extension the `really-simple-args` tool, use the terms
Argument, Parameter, Flag, and Shorthand. See below for how that is defined for
this project, to avoid any confusion.

### Parameter

Anything that starts with a single `-` character, and is followed by some value.

*Example:*

```
my-cli-tool -u root
```

In this case, `u` is a parameter, and its value is the string `root`. 

### Flag

Anything that starts with two `-` characters. Does not have any associated 
value.

*Example:*

```
my-cli-tool --foobar --my-flag
```

In this case, both `foobar` and `my-flag` are flags.

### Argument

Anything that isn't a parameter, flag, or shorthand, and isn't the value of a
parameter.

*Example:*

```
my-cli-tool --foobar -a b --baz my-parameter
```

In thiscase, neither `foobar`, `baz`, `a`, *or* `b` are considered parameters
by `really-simple-args`. Only `my-parameter` is a parameter, and would be in 
parameter slot `0`. 

### Shorthand

A shorthand is a single character argument. It can either appear solo with a `-`
preceding it, or shorthands can be batched together, any number of them together
in one sequence with a `-` before it.

In addition, shorthands must be registered with this tool in order to be 
recognized, to avoid shorthands overlapping parameters. Shorthands can also 
represent other parameters or flags. See the [Usage](#usage) section for more
information on how to register shorthands.

*Example:*

Let's assume that you have previously registered the shorthands `a` and `c`,
and your CLI tool was called like this:

```
my-cli-tool --foo -ac baz
```

In a normal case, `ac` would be an available parameter, with the value of `baz`.
However, in this case, because you have registered those shorthands, the
shorthands `a` and `c` would both be present, and `baz` would become an argument
in argument index `0`.

It's also worth noting that these shorthands have been batched together, but the
same exact result would be true if specified like:

```
my-cli-tool --foo -a -c baz
```

Or like this:

```
my-cli-tool -a --foo baz -c
```

Finally, since shorthands *can* (but do not have to) represent flags and 
parameters, it's possible that the shorthand `a` could represent flag `foo`,
which would then cause `really-simple-args` to throw an error, because the `foo`
flag is present twice. See the [Usage](#usage) section for more information on
registering and using shorthands.

## Usage

First, add it to your source file that you want to read arguments from:

```Javascript
const args = require("really-simple-args")();
```

This will automatically cause the args manager to sort and cache all your 
arguments, so you can then use methods on the `args` object to access and 
check to see if any arguments/parameters/flags were used.

The args manager *will* throw an error if multiple flags or arguments exist.

Unless otherwise specified below, all of these methods can be called off of the 
`args` object, or whatever you choose to name it.

### Register Shorthands

When constructing `really-simple-args`, you can optionally pass an array of
shorthands as the first parameter:

```Javascript
const args = require("really-simple-args")([/* shorthands go here */]);

// Or if you want a more legible syntax
const parseArgs = require("really-simple-args");

const args = parseArgs([
    /* shorthands go here */
]);
```

Shorthands are single character special arguments that can optionally represent
flags or parameters.

To specify a shorthand that doesn't represent any other arguments, just pass it
as a string:

```Javascript
const args = require("really-simple-args")(["a", "b"]);

// Assuming the CLI was called like: my-cli -ab

args.shorthandIsPresent("a"); // true
args.shorthandIsPresent("b"); // true
```

In the case above, the shorthands `a` and `b` are now registered.

You can also make shorthands represent certain flags or parameters by passing
a configuration object instead of a string for a shorthand:

```Javascript
const args = require("really-simple-args")([
    "a",
    {
        name: "b",
        shortFor: [
            "--foo",
            ["-bar", "param0"]
        ]
    }
]);

// Assuming the CLI was called like: my-cli -ab

args.shorthandIsPresent("a"); // true
args.shorthandIsPresent("b"); // true
args.hasFlag("foo"); // true
args.hasParameter("bar"); // true
args.getParameter("bar"); // "param0"
```

In the above, the shorthands `a` and `b` are still present, similar to the last
example. However, in this example, the shorthand `b` is short for the `foo`
flag. This means that whenever the `b` shorthand is present, it will act as both
a shorthand and a flag. If you were to check to see if the `foo` flag was
present when the `b` shorthand was specified, it would return true.

In the same vein, the parameter `bar` is also present with the value of `param0`
whenever the shorthand `b` is present.

As you may have noticed, the `shortFor` property is an array. A shorthand can 
have any number of flags or parameters that it represents.

**Warning:** Flags and parameters specified for a shorthand function exactly as
though the user specified those flags/parameters where the shorthand is. This 
means that if the flag that a shorthand represents is present again later in the
arguments, this tool will throw an error.

### Get Argument by Index

```
getArgumentByIndex(index: Integer): String|undefined
```

Retrieves an argument based on its index. Will either return the argument value
or `undefined` if an argument at the specified index does not exist.

The index an argument is assigned assumes that the command, any flags, and 
any parameters and their values are not counted. So, for example, given a call 
like:

```
my-cli --foo -bar baz --foobar my-argument --foobaz another-argument
```

The computed index of `my-argument` in this example is `0`, and the computed 
index of `another-argument` is `1`, as all the other parts are ignored.

### Get Amount of Arguments

```
getAmountOfArguments(): Integer
```

Returns the amount of floating arguments (arguments not part of a flag or 
parameter).

### Determine if Flag Exists

```
hasFlag(name: String): Boolean
```

Returns true if the specified flag `name` exists. The flag name should be the 
name of the flag minus the `--` at the beginning.

### Determine if Parameter Exists

```
hasParameter(name: String): Boolean
```

Returns true if the specified parameter `name` exists. The parameter name should
be the name of the parameter minus the `-` at the beginning.

### Get Parameter Value

```
getParameter(name: String): String|null
```

Returns the value of the specified parameter (by name) if it exists, or `null`
if it does not. The name of the parameter should be the parameter minus the `-`
at the beginning.

### Determine If Shorthand Exists

```
hasShorthand(name: String): Boolean
```

Returns true if the given shorthand (without `-` prefix) has been
**registered**. This does not indicate whether or not the CLI has been called
with the given shorthand.

### Determine If Shorthand Is Being Used

```
shorthandIsPresent(name: String): Boolean
```

Returns true if the given shorthand (without the `-` prefix) is present in the 
arguments of the CLI tool, either in shorted form (`-ab`) or in spaced form
(`-a -b`).

Keep in mind that if a shorthand proxies flags or parameters, you can find
whether those exist using their appropriate methods.