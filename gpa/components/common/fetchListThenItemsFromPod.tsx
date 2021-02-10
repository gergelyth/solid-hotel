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

function FetchItems<T>(
  swrKey: string,
  listUrl: string,
  convertToType: (dataset: SolidDataset, url: string) => T | null
): {
  items: (T | null)[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const fetcher = (_: string, url: string): Promise<(T | null)[]> => {
    return GetDataSet(url).then((dataset) => {
      const urls = getContainedResourceUrlAll(dataset);
      const items = urls.map((itemUrl) =>
        ProcessItem<T>(itemUrl, convertToType)
      );
      return Promise.all(items);
    });
  };

  // here we have to care that this key in useSWR has to be unique across the whole application (to handle caching)
  // so perhaps use more descriptive name, such as "solid-firstName" or whatever

  // if we specify key (first argument of useSWR) as an array, the ID for caching will be calculated for the combination of the elements
  // https://swr.vercel.app/docs/arguments

  const { data, error } = useSWR([swrKey, listUrl], fetcher);
  return {
    items: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function GetItems<T>(
  swrKey: string,
  listUrl: string,
  createElement: (item: T | null) => JSX.Element,
  convertToType: (dataset: SolidDataset, url: string) => T | null
): JSX.Element {
  const { items, isLoading, isError } = FetchItems(
    swrKey,
    listUrl,
    convertToType
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError || !items) {
    return <div>Fetching the list failed.</div>;
  }

  const isArrayNonEmpty =
    items.length > 0 && items.some((item) => item !== null);

  return (
    <div>
      {isArrayNonEmpty ? (
        <ul>{items.map((item) => createElement(item))}</ul>
      ) : (
        <i>No items found</i>
      )}
    </div>
  );
}
