import useSWR from "swr";
import {
  getContainedResourceUrlAll,
  SolidDataset,
  UrlString,
} from "@inrupt/solid-client";
import { GetDataSet } from "../../util/solid";

function ProcessItem<T>(
  url: UrlString,
  convertToType: (dataset: SolidDataset, url: string) => T | null
): Promise<T | null> {
  return GetDataSet(url).then((dataset) => {
    return convertToType(dataset, url);
  });
}

export function FetchItems<T>(
  swrKey: string,
  listUrl: string,
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
