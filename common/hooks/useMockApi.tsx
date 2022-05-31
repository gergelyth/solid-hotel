import useSWR from "swr";
import {
  AddLoadingIndicator,
  RemoveLoadingIndicator,
} from "../components/loading-indicators";
import { HotelLocation } from "../consts/hotelConsts";
import { DataProtectionInformation } from "../util/apiDataRetrieval";
import { ShowError } from "../util/helpers";
import { personFieldToRdfMap } from "../vocabularies/rdf_person";
import { useGuest } from "./useGuest";

function useMockApi<T>(
  baseApiUrl: string,
  nationality?: string,
  webId?: string
): {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const fetcher = (
    baseApiUrl: string,
    guestNationality: string
  ): Promise<T | undefined> => {
    const searchParams = new URLSearchParams();
    searchParams.append("hotelLocation", HotelLocation);
    searchParams.append("guestNationality", guestNationality);

    const url = `${baseApiUrl}?${searchParams.toString()}`;

    return fetch(url).then((fetchResult) =>
      fetchResult.json().then((jsonResult) => {
        const parsedResult: T = jsonResult;
        return parsedResult;
      })
    );
  };

  //we call this conditionally - if we have the nationality, we won't call the SWR
  const guest = useGuest(
    nationality ? undefined : [personFieldToRdfMap.nationality],
    webId
  );

  let fetchFunction;
  if (nationality) {
    fetchFunction = () => [baseApiUrl, nationality];
  } else {
    fetchFunction = function fetchFunction():
      | (string | null | undefined)[]
      | null {
      if (!guest || !guest.guestFields) {
        ShowError("Error retrieving guest nationality", true);
        return null;
      }

      return [baseApiUrl, guest.guestFields[0].fieldValue];
    };
  }

  //TODO is this immutable? can we use useImmutableSwr?
  const { data, error, isValidating } = useSWR(fetchFunction, fetcher);

  const swrKey = fetchFunction();
  if (swrKey) {
    const swrKeyString = swrKey.join();
    if (isValidating) {
      AddLoadingIndicator(swrKeyString);
    } else {
      RemoveLoadingIndicator(swrKeyString);
    }
  }

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useRequiredFields(
  nationality?: string,
  webId?: string
): {
  data: string[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  // return useMockApi<string[]>("/api/requiredFields");
  //TODO shouldnt be hardcoded!!!
  return useMockApi<string[]>(
    "http://localhost:3003/api/requiredFields",
    nationality,
    webId
  );
}

export function useDataProtectionInformation(
  nationality?: string,
  webId?: string
): {
  data: DataProtectionInformation | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  // return useMockApi<DataProtectionInformation>("/api/dataprotection");
  //TODO shouldnt be hardcoded!!!
  return useMockApi<DataProtectionInformation>(
    "http://localhost:3003/api/dataprotection",
    nationality,
    webId
  );
}
