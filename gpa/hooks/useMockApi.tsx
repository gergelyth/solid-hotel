import useSWR from "swr";
import { HotelLocation } from "../consts/hotelConsts";
import { DataProtectionInformation } from "../util/apiDataRetrieval";
import { useGuest } from "./useGuest";

function useMockApi<T>(
  baseApiUrl: string
): {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const fetcher = (
    baseApiUrl: string,
    guestNationality: string
  ): Promise<T> => {
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

  const guest = useGuest();
  const dependentFetchFunction = (): (string | null)[] | null => {
    if (!guest || !guest.guest) {
      return null;
    }
    return [baseApiUrl, guest.guest.nationality];
  };

  const { data, error } = useSWR(dependentFetchFunction, fetcher);

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  };
}

export function useRequiredFields(): {
  data: string[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  return useMockApi<string[]>("/api/requiredFields");
}

export function useDataProtectionInformation(): {
  data: DataProtectionInformation | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  return useMockApi<DataProtectionInformation>("/api/dataprotection");
}
