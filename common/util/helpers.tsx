import { getContainedResourceUrlAll } from "@inrupt/solid-client";
import { addDays, startOfDay, startOfTomorrow } from "date-fns";
import { NotLoggedInSnackbarKey } from "../components/auth/login-component";
import { ShowErrorSnackbar } from "../components/snackbar";
import { NotFoundError } from "./errors";
import { GetDataSet } from "./solid";

/**
 * Helper function which creates a reverse mapping of a Record.
 * @returns A Record which has the values as keys and the keys as values.
 */
export function ReverseRecord<T extends PropertyKey, U extends PropertyKey>(
  input: Record<T, U>
): Record<U, T> {
  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => [value, key])
  ) as Record<U, T>;
}

/**
 * Filters out all null and undefined items.
 * Also takes care of typing because of generics.
 * @returns A function which returns false for null or undefined items.
 */
export function NotEmptyItem<T>(item: T | null | undefined): item is T {
  return item !== null && item !== undefined;
}

/**
 * Expand URL paths in case they contain a * wildcard.
 * Also keep a cache to avoid re-fetching a resource multiple times.
 * @returns An array of URL paths with the * wildcard resolved.
 */
export async function GlobSolidUrlPaths(
  urlRegex: string,
  resourceCache: { [url: string]: string[] }
): Promise<string[]> {
  let result: string[] = [];

  if (urlRegex.indexOf("*") === -1) {
    result.push(urlRegex);
    return result;
  }

  const [firstPart, lastPart] = [
    urlRegex.slice(0, urlRegex.indexOf("*")),
    urlRegex.slice(urlRegex.indexOf("*") + 1),
  ];

  let containedResources: string[];
  //TODO not sure if this is efficient
  if (firstPart in resourceCache) {
    containedResources = resourceCache[firstPart];
  } else {
    const dataSet = await GetDataSet(firstPart);
    if (!dataSet) {
      throw new NotFoundError(`Dataset at ${firstPart} not found.`);
    }
    containedResources = getContainedResourceUrlAll(dataSet);
    resourceCache[firstPart] = containedResources;
  }

  const promises = containedResources.map(async (resource) => {
    const firstGlob = resource + lastPart;
    return GlobSolidUrlPaths(firstGlob, resourceCache).then((paths) => {
      result = result.concat(paths);
    });
  });

  return Promise.all(promises).then(() => result);
}

/**
 * Adds the specified number of years, months and days to the current date.
 * @returns The offset date.
 */
export function GetCurrentDatePushedBy(
  yearOffset: number,
  monthOffset: number,
  dayOffset: number
): Date {
  const date = new Date();
  const year = date.getFullYear() + yearOffset;
  const month = date.getMonth() + monthOffset;
  const day = date.getDate() + dayOffset;

  date.setFullYear(year, month, day);
  return date;
}

/** @returns The current datetime. */
export function GetToday(): Date {
  return new Date();
}

/** @returns The start of tomorrow. */
export function GetTomorrow(): Date {
  return startOfTomorrow();
}

/** @returns Adds one day to the date supplied as argument. */
export function GetDayAfterDate(date: Date): Date {
  return addDays(date, 1);
}

/** @returns Gets the start of the day after the day supplied as argument. */
export function GetStartOfNextDay(date: Date): Date {
  return startOfDay(addDays(date, 1));
}

/**
 * A generic error reporting function used when a data retrieving SWR hook runs into trouble.
 * Reports the error in a snackbar as well as the console.
 */
export function OnHookErrorFunction(error: Error, key: string): void {
  //Standard message from Solid exception - not the most robust way to match errors, but this is unfortunately the only thing we get from the lib
  if (error.message === "Not signed in") {
    ShowErrorSnackbar(
      "User is not signed in. Functionality is severely limited.",
      true,
      true,
      NotLoggedInSnackbarKey
    );
    return;
  }

  ShowErrorSnackbar(
    `Error using hook: [${error.message}]. See console for details.`
  );
  console.error(`Error using hook for key [${key}]`);
  console.error(error);
}

/**
 * A generic error reporting function called when something goes wrong.
 * Attaches a warning message about potentially unstable state if the operation is not recoverable.
 * Reports the error with a snackbar as well as the console.
 */
export function ShowError(message: string, recoverable: boolean): void {
  if (!recoverable) {
    message += " - unexpected behaviour might occur.";
  }
  ShowErrorSnackbar(message);
  console.error(message);
}
