import { act, renderHook } from "@testing-library/react-hooks";
import { xmlSchemaTypes } from "../../consts/supportedTypes";
import { useGuest } from "../useGuest";
import { Field } from "../../types/Field";
import { useDataProtectionInformation, useRequiredFields } from "../useMockApi";
import { DataProtectionInformation } from "../../util/apiDataRetrieval";

const testGuestFields: Field[] = [
  {
    fieldShortName: "nationality",
    fieldPrettyName: "Nationality",
    fieldValue: "Spanish",
    rdfName: "schema:nationality",
    datatype: xmlSchemaTypes.string,
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
        json: () => Promise.resolve(["foaf:firstName", "foaf:familyName"]),
      })
    ) as jest.Mock;

    const { result, waitForNextUpdate } = renderHook(() =>
      useRequiredFields("English", "TestWebId")
    );
    await act(async () => {
      await waitForNextUpdate();
    });
    expect(result.error).toBeUndefined();

    const returnValue = result.current;
    expect(returnValue.isLoading).toBeFalsy();
    expect(returnValue.isError).toBeUndefined();

    expect(returnValue.data).toEqual(["foaf:firstName", "foaf:familyName"]);

    expect(useGuest).toBeCalledTimes(2);
    //Calling useGuest with an undefined key parameter won't call the hook (we need to call it because of the rules of the hooks, but SWR won't execute)
    expect(useGuest).toHaveBeenNthCalledWith(1, undefined, "TestWebId");
    expect(useGuest).toHaveBeenNthCalledWith(2, undefined, "TestWebId");

    expect(global.fetch).toBeCalledWith(
      "http://localhost:3003/api/requiredFields?hotelLocation=France&guestNationality=English"
    );
  });

  test("useRequiredFields with nationality missing calls useGuest to retrieve the nationality and returns correct data", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(["foaf:firstName", "foaf:familyName"]),
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

    expect(returnValue.data).toEqual(["foaf:firstName", "foaf:familyName"]);

    expect(useGuest).toBeCalledTimes(2);
    expect(useGuest).toHaveBeenNthCalledWith(
      1,
      ["schema:nationality"],
      "TestWebId"
    );
    expect(useGuest).toHaveBeenNthCalledWith(
      2,
      ["schema:nationality"],
      "TestWebId"
    );

    expect(global.fetch).toBeCalledWith(
      "http://localhost:3003/api/requiredFields?hotelLocation=France&guestNationality=Spanish"
    );
  });

  test("useDataProtectionInformation works as expected", async () => {
    const expectedDataProtectionInformation: DataProtectionInformation = {
      dataProtectionYears: 5,
      dataProtectionFields: ["schema:idDocumentNumber", "schema:email"],
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            dataProtectionYears: 5,
            dataProtectionFields: ["schema:idDocumentNumber", "schema:email"],
          }),
      })
    ) as jest.Mock;

    const { result, waitForNextUpdate } = renderHook(() =>
      useDataProtectionInformation("English", "TestWebId")
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
      "http://localhost:3003/api/dataprotection?hotelLocation=France&guestNationality=English"
    );
  });
});
