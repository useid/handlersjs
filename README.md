# Handlers.js

Handlers.js provides a modular framework based on the abstraction of software components as _handlers_ of data. Using the handlers in this repository, and custom handlers you build yourself, you can compose multiple specialized modules into a full application. Building software this way ensures easily maintainable, configurable and rewireable applications.

The real power of — and inspiration for — Handlers.js comes from the [Components.js](https://componentsjs.readthedocs.io) dependency injection framework, for which each package provides the necessary component configuration files. Combining Handlers.js with Components.js enables you to define each software component separately, and then wire them together declaratively using semantic configuration in JSON files, instead of hard-wiring them together in code.

## Packages

- `handlersjs-core` contains the basic handler model, and some high-level generic handlers.
- `handlerjs-http` provides a model for HTTP servers, a Node.js implementation thereof, and handlers for path routing, CORS, serving assets etc.
- `handlerjs-logging` enables the retrieval of global loggers, and provides implementations for the console and for Winston.
- `handlerjs-storage` defines several models of key-value storage, and contains implementations based on local storage, JSON file storage, and in memory storage.

## Usage

The packages in this repo are hosted on the [GitHub npm registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry). To use them, make sure your git configuration contains you GitHub username and e-mail address as values for the `user.name` and `user.email` parameters. You will also need a [personal access token](https://github.com/settings/tokens) with at least the `write:packages` and `read:packages` scopes, and use it to log in to the registry.

```
$ git config --global user.name [your GitHub username]
$ git config --global user.email [your GitHub e-mail address]
$ npm login --registry=https://npm.pkg.github.com
Username: [your GitHub username]
Password: [your personal access token]
Email: [your GitHub e-mail address]
```

## Contributing

Bugs and other issues are very welcome. To contribute PRs, clone the repository, and set up your git environment as specified above.

```
$ git clone git@github.com:digita-ai/handlersjs.git
```
