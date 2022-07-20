import { useHotel } from "../useHotel";
import { act, renderHook } from "@testing-library/react-hooks";
import { GetProfileOf, SolidProfile } from "../../util/solidProfile";
import { addStringNoLocale, createThing, Thing } from "@inrupt/solid-client";
import { hotelFieldToRdfMap } from "../../vocabularies/rdf_hotel";
import { HotelDetails } from "../../types/HotelDetails";

jest.mock("../../util/solidProfile", () => {
  return {
    GetProfileOf: jest.fn(),
  };
});
jest.mock("../../components/loading-indicators", () => {
  return {
    AddLoadingIndicator: jest.fn(),
    RemoveLoadingIndicator: jest.fn(),
  };
});

const hotelWebId = "TestHotelWebId";

function CreateMockProfile(): Thing {
  let thing = createThing({ name: hotelWebId });
  thing = addStringNoLocale(thing, hotelFieldToRdfMap.name, "HotelName");
  thing = addStringNoLocale(
    thing,
    hotelFieldToRdfMap.location,
    "HotelLocation"
  );
  thing = addStringNoLocale(thing, hotelFieldToRdfMap.address, "HotelAddress");
  return thing;
}

const testSolidProfile: SolidProfile = {
  profileAddress: hotelWebId,
  profile: CreateMockProfile(),
  dataSet: null,
};

beforeEach(() => {
  act(() => {
    jest.useFakeTimers();
  });
  //Default implementation
  (GetProfileOf as jest.Mock).mockImplementation(async () => {
    return testSolidProfile;
  });
});

afterEach(() => {
  act(() => {
    jest.runAllTimers();
  });
});

describe("useHotel", () => {
  test("Ideal circumstances return expected data", async () => {
    const expectedHotelDetails: HotelDetails = {
      webId: "TestHotelWebId",
      name: "HotelName",
      location: "HotelLocation",
      address: "HotelAddress",
    };

    const { result, waitForNextUpdate } = renderHook(() =>
      useHotel(hotelWebId)
    );
    await act(async () => {
      await waitForNextUpdate();
    });
    expect(result.error).toBeUndefined();

    const returnValue = result.current;
    expect(returnValue.isLoading).toBeFalsy();
    expect(returnValue.isError).toBeUndefined();

    expect(returnValue.hotelDetails).toEqual(expectedHotelDetails);
  });

  test("Null hotel profile doesn't return data", async () => {
    (GetProfileOf as jest.Mock).mockImplementation(async () => {
      return {
        profileAddress: hotelWebId,
        profile: null,
        dataSet: null,
      };
    });
    const { result, waitForNextUpdate } = renderHook(() =>
      useHotel(hotelWebId)
    );
    await act(async () => {
      await waitForNextUpdate();
    });
    expect(result.error).toBeUndefined();

    const returnValue = result.current;
    expect(returnValue.isLoading).toBeTruthy();
    expect(returnValue.isError).toBeUndefined();
    expect(returnValue.hotelDetails).toBeUndefined();
  });
});
