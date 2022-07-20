import { act, renderHook } from "@testing-library/react-hooks";
import { xmlSchemaTypes } from "../../consts/supportedTypes";
import { useGuest } from "../useGuest";
import { Field } from "../../types/Field";
import { useDataProtectionInformation, useRequiredFields } from "../useMockApi";
import { DataProtectionInformation } from "../../util/apiDataRetrieval";
import { personFieldToRdfMap } from "../../vocabularies/rdf_person";
import { countryToRdfMap } from "../../vocabularies/rdf_countries";
import { escape } from "querystring";

const testGuestFields: Field[] = [
  {
    fieldShortName: "nationality",
    fieldPrettyName: "Nationality",
    fieldValue: countryToRdfMap.ESP,
    rdfName: personFieldToRdfMap.nationality,
    datatype: xmlSchemaTypes.country,
  },
];

jest.mock("../../hooks/useGuest", () => {
  return {
    useGuest: jest.fn(),
  };
});

beforeEach(() => {
  act(() => {
    jest.useFakeTimers();
  });
  (useGuest as jest.Mock).mockImplementation(() => {
    return {
      guestFields: testGuestFields,
      isLoading: false,
      isError: false,
    };
  });
  jest.clearAllMocks();
});

afterEach(() => {
  act(() => {
    jest.runAllTimers();
  });
});

describe("useMockApi", () => {
  test("useRequiredFields with nationality passed in works as expected and doesn't call useGuest", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            personFieldToRdfMap.firstName,
            personFieldToRdfMap.lastName,
          ]),
      })
    ) as jest.Mock;

    const { result, waitForNextUpdate } = renderHook(() =>
      useRequiredFields(countryToRdfMap.GBR, "TestWebId")
    );
    await act(async () => {
      await waitForNextUpdate();
    });
    expect(result.error).toBeUndefined();

    const returnValue = result.current;
    expect(returnValue.isLoading).toBeFalsy();
    expect(returnValue.isError).toBeUndefined();

    expect(returnValue.data).toEqual([
      personFieldToRdfMap.firstName,
      personFieldToRdfMap.lastName,
    ]);

    expect(useGuest).toBeCalledTimes(2);
    //Calling useGuest with an undefined key parameter won't call the hook (we need to call it because of the rules of the hooks, but SWR won't execute)
    expect(useGuest).toHaveBeenNthCalledWith(1, undefined, "TestWebId");
    expect(useGuest).toHaveBeenNthCalledWith(2, undefined, "TestWebId");

    expect(global.fetch).toBeCalledWith(
      `http://localhost:3003/api/requiredFields?hotelLocation=${escape(
        countryToRdfMap.FRA
      )}&guestNationality=${escape(countryToRdfMap.GBR)}`
    );
  });

  test("useRequiredFields with nationality missing calls useGuest to retrieve the nationality and returns correct data", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            personFieldToRdfMap.firstName,
            personFieldToRdfMap.lastName,
          ]),
      })
    ) as jest.Mock;

    const { result, waitForNextUpdate } = renderHook(() =>
      useRequiredFields(undefined, "TestWebId")
    );
    await act(async () => {
      await waitForNextUpdate();
    });
    expect(result.error).toBeUndefined();

    const returnValue = result.current;
    expect(returnValue.isLoading).toBeFalsy();
    expect(returnValue.isError).toBeUndefined();

    expect(returnValue.data).toEqual([
      personFieldToRdfMap.firstName,
      personFieldToRdfMap.lastName,
    ]);

    expect(useGuest).toBeCalledTimes(2);
    expect(useGuest).toHaveBeenNthCalledWith(
      1,
      [personFieldToRdfMap.nationality],
      "TestWebId"
    );
    expect(useGuest).toHaveBeenNthCalledWith(
      2,
      [personFieldToRdfMap.nationality],
      "TestWebId"
    );

    expect(global.fetch).toBeCalledWith(
      `http://localhost:3003/api/requiredFields?hotelLocation=${escape(
        countryToRdfMap.FRA
      )}&guestNationality=${escape(countryToRdfMap.ESP)}`
    );
  });

  test("useDataProtectionInformation works as expected", async () => {
    const expectedDataProtectionInformation: DataProtectionInformation = {
      dataProtectionStorageDuration: { years: 0, months: 0, days: 2 },
      dataProtectionFields: [
        personFieldToRdfMap.idDocumentNumber,
        personFieldToRdfMap.email,
      ],
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            dataProtectionStorageDuration: { years: 0, months: 0, days: 2 },
            dataProtectionFields: [
              personFieldToRdfMap.idDocumentNumber,
              personFieldToRdfMap.email,
            ],
          }),
      })
    ) as jest.Mock;

    const { result, waitForNextUpdate } = renderHook(() =>
      useDataProtectionInformation(countryToRdfMap.GBR, "TestWebId")
    );
    await act(async () => {
      await waitForNextUpdate();
    });
    expect(result.error).toBeUndefined();

    const returnValue = result.current;
    expect(returnValue.isLoading).toBeFalsy();
    expect(returnValue.isError).toBeUndefined();

    expect(returnValue.data).toEqual(expectedDataProtectionInformation);

    expect(useGuest).toBeCalledTimes(2);
    //Calling useGuest with an undefined key parameter won't call the hook (we need to call it because of the rules of the hooks, but SWR won't execute)
    expect(useGuest).toHaveBeenNthCalledWith(1, undefined, "TestWebId");
    expect(useGuest).toHaveBeenNthCalledWith(2, undefined, "TestWebId");

    expect(global.fetch).toBeCalledWith(
      `http://localhost:3003/api/dataprotection?hotelLocation=${escape(
        countryToRdfMap.FRA
      )}&guestNationality=${escape(countryToRdfMap.GBR)}`
    );
  });
});
