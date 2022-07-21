import useSWR from "swr";
import {
  AddLoadingIndicator,
  RemoveLoadingIndicator,
} from "../components/loading-indicators";
import { HotelLocation } from "../consts/hotelConsts";
import {
  MockApiDataProtectionUrl,
  MockApiRequiredFieldsUrl,
} from "../consts/locations";
import { DataProtectionInformation } from "../util/apiDataRetrieval";
import { PersonFieldToRdfMap } from "../vocabularies/rdfPerson";
import { useGuest } from "./useGuest";

/**
 * Connects to the mock API and fetches the result retrieved from the endpoint.
 * Provides the hotel location and guest nationality as query parameters.
 * If no nationality is passed, it uses the {@link useGuest} hook to retrieve it according to the WebId.
 * If no WebId is passed, the profile retrieved will be the one belonging to the default session.
 * SWR settings are taken from {@link GlobalSwrConfig}
 * @returns Data retrieved from the mock API parsed to the appropriate type (array of strings or {@link DataProtectionInformation})
 */
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
    nationality ? undefined : [PersonFieldToRdfMap.nationality],
    webId
  );

  let fetchFunction;
  if (nationality) {
    fetchFunction = () => [baseApiUrl, nationality];
  } else {
    fetchFunction = (): (string | null | undefined)[] | null => {
      if (!guest || !guest.guestFields) {
        return null;
      }

      return [baseApiUrl, guest.guestFields[0].fieldValue];
    };
  }

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

/**
 * Fetches the array of required RDF fields for booking and check-in operation that the guest must have filled out in their Solid profile.
 * The required fields are based on the location of the hotel and the nationality of the guest.
 * Connects to the mock API server and parses the result.
 * If no nationality is passed, it uses the {@link useGuest} hook to retrieve it according to the WebId.
 * If no WebId is passed, the profile retrieved will be the one belonging to the default session.
 * SWR settings are taken from {@link GlobalSwrConfig}
 * @returns An array of the required RDF fields and further flags representing the state of the fetch (isLoading, isError).
 */
export function useRequiredFields(
  nationality?: string,
  webId?: string
): {
  data: string[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  return useMockApi<string[]>(MockApiRequiredFieldsUrl, nationality, webId);
}

/**
 * Fetches the information used to create the data protection profiles for the guest after check-out.
 * The required fields are based on the location of the hotel and the nationality of the guest.
 * Connects to the mock API server and parses the result.
 * If no nationality is passed, it uses the {@link useGuest} hook to retrieve it according to the WebId.
 * If no WebId is passed, the profile retrieved will be the one belonging to the default session.
 * SWR settings are taken from {@link GlobalSwrConfig}
 * @returns The data protection options and further flags representing the state of the fetch (isLoading, isError).
 */
export function useDataProtectionInformation(
  nationality?: string,
  webId?: string
): {
  data: DataProtectionInformation | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  return useMockApi<DataProtectionInformation>(
    MockApiDataProtectionUrl,
    nationality,
    webId
  );
}
