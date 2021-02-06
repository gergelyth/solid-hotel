import useSWR from "swr";
import { GetField } from "../util/solid";
import { personFieldToRdfMap } from "../vocabularies/rdf_person";

export function useUserName(): {
  userName: string | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const fetcher = (_: string, field: string): Promise<string> => {
    return GetField(field).then((res) => res);
  };

  // here we have to care that this key in useSWR has to be unique across the whole application (to handle caching)
  // so perhaps use more descriptive name, such as "solid-firstName" or whatever

  // if we specify key (first argument of useSWR) as an array, the ID for caching will be calculated for the combination of the elements
  // https://swr.vercel.app/docs/arguments
  const { data, error } = useSWR(
    ["user_solid", personFieldToRdfMap.firstName],
    fetcher
  );

  return {
    userName: data,
    isLoading: !error && !data,
    isError: error,
  };
}
