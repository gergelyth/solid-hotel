import useSWR from "swr";
import {
  getContainedResourceUrlAll,
  SolidDataset,
  UrlString,
} from "@inrupt/solid-client";
import { GetDataSet } from "../../util/solid";

/**
 * Fetches the contained item and convert it to the appropriate type according to the passed function.
 * @returns A Promise with the item converted or null
 */
function ProcessItem<T>(
  url: UrlString,
  convertToType: (dataset: SolidDataset, url: string) => T | null
): Promise<T | null> {
  return GetDataSet(url).then((dataset) => {
    return convertToType(dataset, url);
  });
}

/**
 * A util function to first fetch a container from a Solid Pod and then fetch the resources contained in that container.
 * The individual resources are then converted to type T according to the convertToType function.
 * Optionally it's possible to append a suffix to the resource URLs according to the decorateContainedItemUrl function.
 * SWR settings are taken from {@link GlobalSwrConfig}
 * @returns The contained resource items converted to the appropriate type and further flags representing the state of the fetch (isLoading, isError, isValidating).
 */
export function FetchItems<T>(
  swrKey: string,
  listUrl: string | null,
  convertToType: (dataset: SolidDataset, url: string) => T | null,
  decorateContainedItemUrl: (itemUrl: string) => string = (itemUrl) => itemUrl
): {
  items: (T | null)[] | undefined;
  isLoading: boolean;
  isError: boolean;
  isValidating: boolean;
} {
  const fetcher = (_: string, url: string): Promise<(T | null)[]> => {
    return GetDataSet(url).then((dataset) => {
      const urls = getContainedResourceUrlAll(dataset);
      const items = urls.map((itemUrl) => {
        const decoratedUrl = decorateContainedItemUrl(itemUrl);
        return ProcessItem<T>(decoratedUrl, convertToType);
      });
      return Promise.all(items);
    });
  };

  // here we have to care that this key in useSWR has to be unique across the whole application (to handle caching)
  // so perhaps use more descriptive name, such as "solid-firstName" or whatever

  // if we specify key (first argument of useSWR) as an array, the ID for caching will be calculated for the combination of the elements
  // https://swr.vercel.app/docs/arguments

  const { data, error, isValidating } = useSWR([swrKey, listUrl], fetcher);
  return {
    items: data,
    isLoading: !error && !data,
    isError: error,
    isValidating: isValidating,
  };
}
