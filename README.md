# Complan

A Complexity Analyzer Tool which computes software complexity for a Javascript project hosted on Github.

* [How it works](#how-it-works)
* [Installation](#installation)
* [Usage](#usage)
    * [Command-line options](#command-line-options)
* [License](#license)

## How it works

```Complan``` is a node.js based
command-line wrapper around [complexity-report] (https://www.npmjs.com/package/complexity-report) which computes code complexity for a Javascript project hosted on Github.


## Installation

Assuming you've nodejs installed,

For a project-based ~~install:~~

```
npm install complan
```

For global installation:

```
sudo npm install -g complan
```

## Usage

```
complan -g <git url>
```
```
e.g 
complan -g https://github.com/pranavparikh/complan
or 
complan -g git@github.com:pranavparikh/complan.git
```
The above command will generate complexity report under a directory named ```pranavparikh/complan``` in your current directory.

The tool will locally clone the repository from git (Git has to be installed as a pre-requisite) , compute complexity and output it in a form of JSON report.

### Command-line options

```
-h, --help                            output usage information
-g, --gitUrl <path>                   specify the http url or the git url of the repository

## License

[MIT]