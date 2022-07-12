# Programming documentation

We will provide an overview of the codebase here as well as mention a couple of notes about some other functionalities surrounding the project.

## Overview

## Testing

We use [jest](https://jestjs.io/) in our project to automate the testing of functions, hooks and React components. In addition to this, we use the [ts-jest](https://github.com/kulshekhar/ts-jest) to make our tests more TypeScript friendly.

Element testing is done with the help of [@testing-library](https://testing-library.com/) packages (we also find the [react-hooks-testing-library](https://react-hooks-testing-library.com/) handy to help us test our custom hooks). We simulate user interactions with the [user-event](https://testing-library.com/docs/user-event/intro/) library.

Tests are placed in a `__tests__` folder in each appropriate directory.

To run the tests, use the command:
```
npm run test
```
Alternatively, during development you may also use the watch functionality of jest by running:
```
npm run test-watch
```


## Generated documentation

The documentation is generated using [TypeDoc](https://typedoc.org/).

We use a small workaround to render the HTML result of the modules found in all projects. To process all modules, navigate to the `common` folder and run the following command:
```
npx typedoc
```
This will produce the `docs` folder in the current directory with the modules and correct cross reference links from all subprojects.

If you wish to generate the docs for only a specific subproject, you may execute the command above in the corresponding subfolder (`gpa`, `pms` or `spe`). In these cases, only the given project's modules and the shared, common modules are included.

TypeDoc options are provided in the `typedoc.json` files placed in each subproject folder. The options exclude all `*.js` files from generation by default.