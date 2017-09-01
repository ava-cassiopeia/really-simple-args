# Really Simple Args

NPM/Node CommonJS module for automatically sorting and managing command-line 
arguments for your command line tool.

## Installation

To install, simply run:

```CLI
npm i really-simple-args
```

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

## Argument vs Parameter vs Flag

This repository, and by extension the `really-simple-args` tool, use the terms
Argument, Parameter, and Flag. See below for how that is defined for this
project, to avoid any confusion.

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

Anything that isn't a parameter or flag, and isn't the value of a parameter.

*Example:*

```
my-cli-tool --foobar -a b --baz my-parameter
```

In thiscase, neither `foobar`, `baz`, `a`, *or* `b` are considered parameters
by `really-simple-args`. Only `my-parameter` is a parameter, and would be in 
parameter slot `0`. 