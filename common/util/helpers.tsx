import { getContainedResourceUrlAll } from "@inrupt/solid-client";
import { addDays, startOfDay, startOfTomorrow } from "date-fns";
import { NotLoggedInSnackbarKey } from "../components/auth/login-component";
import { ShowErrorSnackbar } from "../components/snackbar";
import { NotFoundError } from "./errors";
import { GetDataSet } from "./solid";

export function NotEmptyItem<T>(item: T | null | undefined): item is T {
  return item !== null && item !== undefined;
}

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

export function GetToday(): Date {
  return new Date();
}

export function GetTomorrow(): Date {
  return startOfTomorrow();
}

export function GetDayAfterDate(date: Date): Date {
  return addDays(date, 1);
}

export function GetStartOfNextDay(date: Date): Date {
  return startOfDay(addDays(date, 1));
}

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

export function ShowError(message: string, recoverable: boolean): void {
  if (!recoverable) {
    message += " - unexpected behaviour might occur.";
  }
  ShowErrorSnackbar(message);
  console.error(message);
}
