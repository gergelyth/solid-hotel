# Programming documentation

We will provide an overview of the codebase here as well as mention a couple of notes about some other functionalities surrounding the project.

## Overview

TODO Solid Pod structure, booking, check-in, check-out, profile mod, SWR, RDF vocabularies, setup (serialization), pages (NEXT), notifications, mock API, material

### Solid authentication

Specific implementation functionality is delegated to the `@inrupt/solid-client-authn-browser` library and we define mostly wrappers to tailor the process for our purposes.
The entry point is the login/logout button displayed in the navigation bars of the subprojets. This button takes the user to the `login/` page, which uses the components defined in the `common/components/auth` directory. 

Additionally:
- We check on page reload if we can restore the previous session based on the auth token in effect
- We need to define a workaround on how to load these components as some functions in the auth library call `window`, which is causing issues when the page is pre-rendered on the server side by Next.js. We take advantage of Next's [dynamic loading capability](https://nextjs.org/docs/advanced-features/dynamic-import).

### Snackbars

In order to provide feedback to the user, we use [notistack](https://github.com/iamhosseindhv/notistack) snackbars throughout the application. We enclose the application (`pages/_app`) in a `SnackbarProvider` element and attach an anchor `GlobalSnackbar` element to achieve this.

We use three types of snackbar notifications.

1. Basic snackbar variants of 4 types: info, success, warning and error. These notifications display a simple message to the user in the bottom left corner.
2. Custom snackbars showing various information or informing the user of a background process currently happening. These show in the bottom right corner. We define a generic progress snackbar element (`CustomProgressSnackbar`) which displays a message and a loading bar during the run of a background process (i.e. check-in operation, check-out operation, cancellation, etc.). Since these notifications are essentially React elements, we can also freely call our hooks during them without breaking the [rules of hooks](https://reactjs.org/docs/hooks-rules.html). 
3. Using similar logic as 2., we also use this functionality to display the profile change approval dialogs to the user.

### Error reporting

Errors are reported via a basic snackbar, as well as, in case of a more serious error, through the console.

Errors generated during SWR hook calls are handled in an efficient way through the `onError` property in `GlobalSwrConfig`. Note that we make a special case of the "not logged in" messages received as our application are seriously crippled without an authenticated Solid session. We report that the user is not currently logged in through a persisted snackbar error warning.

In case something goes wrong during a component render, we replace the component with a generic error one defined as `ErrorComponent`.


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