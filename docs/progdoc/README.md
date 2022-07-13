# Programming documentation

We will provide an overview of the codebase here as well as mention a couple of notes about some other functionalities surrounding the project.

## Overview

TODO Solid Pod structure, booking, check-in, check-out, profile mod, RDF vocabularies,  pages (NEXT), notifications, mock API, material

### Solid authentication

Specific implementation functionality is delegated to the `@inrupt/solid-client-authn-browser` library and we define mostly wrappers to tailor the process for our purposes.
The entry point is the login/logout button displayed in the navigation bars of the subprojets. This button takes the user to the `login/` page, which uses the components defined in the `common/components/auth` directory. 

Additionally:
- We check on page reload if we can restore the previous session based on the auth token in effect
- We need to define a workaround on how to load these components as some functions in the auth library call `window`, which is causing issues when the page is pre-rendered on the server side by Next.js. We take advantage of Next's [dynamic loading capability](https://nextjs.org/docs/advanced-features/dynamic-import).

### Setup functionality

The index page of the `common` subproject serves as the setup page for the application prototypes. In essence, this should be the first stop when the applications are used for the first time.

We provide the functions to set up (or clear) the structure the Solid Pods meant to be used by the applications. This is implemented in modules contained in the `common/setup/populateHotelPod` and `common/setup/populateGuestPod` directories.

Besides the simpler, more manual methods, we attempt to match the WebId of the logged in user to recognize the test accounts meant for this project. If the user logs in with either the guest or hotel test account, we also enable the serialization and deserialization of the sample test data.

The (de)serialization is based on the fact that Solid resources are in effect RDF files. Our conversion is as follows (detailing only serialization here, as the opposite direction is symmetrical to the process):
1. We convert the Solid dataset into RdfJs dataset using a function from the `inrupt` library
2. We use [n3](https://github.com/rdfjs/N3.js/) to convert RdfJs into Quads and write it as string
3. After we gather all resources with appropriate filenames and their contents now represented by a simple string, we zip them up with [jszip](https://stuk.github.io/jszip/) and create a download prompt for the user

Also note the following things regarding the (de)serialization process:
1. Since we make heavy use of datetime objects in our applications, we can't do the saving/loading simply without intervention as the test data would become invalid if it would get loaded a month after it was saved (e.g. a reservation would be shown as active, even though the check-out date is long in the past). Because of this, we need special handling to save relative dates rather than absolute ones:
   - We define a constant base datetime object and calculate the intervals between this base date and the moment the serialization happens and save this
   - Upon deserialization we calculate the same interval between the saved relative date and the base date (which is the same as it was during serialization) and add it to the current moment
2. As we grant permissions to certain containers for the Public, we also need to handle ACL files attached to the Solid resources so these may be reinstated during data loading

### Data fetching - SWR

Data fetching is performed using the [SWR](https://swr.vercel.app/) library. The data query works on the following principle
- on the first occassion of the hook call it saves the data retrieved in the cache
- on every subsequent query it immediately returns the cached data to give provide quick feedback while it sends a fetch request to the data storage and returns the fresh query result upon completion

To make it reusable across our codebase, we define custom hooks for the different types of data we need to retrieve (`common/hooks` directory). We override the `fetch` function of SWR for it to be compatible with Solid Pods and parse the results to TS objects.

In order to provide precise feedback to the user, we also returns some flags describing the state of the retrieval. These booleans - such as `isLoading`, `isError` or `isValidating` - help with the interim state of the page until the data can be presented. Additionally, built into our custom hooks is also the capability to display loading bars we dub `loading indicators` to signal when data revalidation is happening in the background. These show up under the navigation bar.

Apart from the general `useSWR` hook, we also use the `mutate` function if we need to trigger a data refetch action.

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