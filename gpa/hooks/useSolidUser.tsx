import useSWR from "swr";
import { GetField } from "../util/solid";
import { fieldToRdfMap } from "../vocabularies/rdf_person";

export function useUserName(): {
  userName: string | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const fetcher = (field: string): Promise<string> => {
    return GetField(field).then((res) => res);
  };

  // here we have to care that this key in useSWR has to be unique across the whole application (to handle caching)
  // so perhaps use more descriptive name, such as "solid-firstName" or whatever
  const { data, error } = useSWR(fieldToRdfMap.firstName, fetcher);

  return {
    userName: data,
    isLoading: !error && !data,
    isError: error,
  };
}
