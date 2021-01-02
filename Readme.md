# Fumble

A dice throwing app, for mobile and other use.
See it life [here](http://fumble.lab.triplet-gmbh.de).

# Hacking

## Preparation

Make sure you have [nodejs](https://nodejs.org/en/) and
[npm](https://www.npmjs.com) installed.

You can test that by typing

    node --version
    npm --version

The source of the Project is managed by [Git](https://git-scm.com/),
which is not *strictly* needed, but you somehow have to get the sources to hack
on them, so why not mercurial.

You can test if you have mercurial installed by typing

    git --version

## Get the project files

Check out the project files by typing

    git clone https://bitbucket.org/tripletgmbh/fumble.git

Alternatively, you can download the sources from the bitbucket page.

## Install the dependencies

Fumble has many dependencies. The dependencies can be installed by typing

     npm install

This may take a long time. Go grab a coffee.

## Building the Software

TODO

# Project Structure

*Fumble* compiles into a single, self-contained html file.

The compilation is started via *webpack*

All files relevant for the compilation reside under `/src`:

* `/src/script` - The typescript source files
* `/src/style` - The less style files
* `/src/images` - SVGs to be inlined

The result of the compilation will be stored in `/dist`, namely it will be
`/dist/index.html`.

*Fumble* uses *Jasmine* for testing, the specs are kept in `/spec`.
