import { act, renderHook } from "@testing-library/react-hooks";
import {
  GetProfile,
  GetProfileOf,
  SolidProfile,
} from "../../util/solidProfile";
import {
  addStringNoLocale,
  addUrl,
  createThing,
  Thing,
} from "@inrupt/solid-client";
import { PersonFieldToRdfMap } from "../../vocabularies/rdfPerson";
import { Field } from "../../types/Field";
import { xmlSchemaTypes } from "../../consts/supportedTypes";
import { RevalidateGuest, TriggerRefetchGuest, useGuest } from "../useGuest";
import { TestGuestFields } from "../../util/__tests__/testUtil";
import { CountryToRdfMap } from "../../vocabularies/rdfCountries";

jest.mock("../../util/solidProfile", () => {
  return {
    GetProfile: jest.fn(),
    GetProfileOf: jest.fn(),
  };
});
jest.mock("../../components/loading-indicators", () => {
  return {
    AddLoadingIndicator: jest.fn(),
    RemoveLoadingIndicator: jest.fn(),
  };
});

const guestWebId = "TestGuestWebId";

function CreateMockProfile(): Thing {
  let thing = createThing({ name: guestWebId });
  thing = addStringNoLocale(thing, PersonFieldToRdfMap.firstName, "John");
  thing = addStringNoLocale(thing, PersonFieldToRdfMap.lastName, "Smith");
  thing = addUrl(thing, PersonFieldToRdfMap.nationality, CountryToRdfMap.GBR);
  return thing;
}

const testSolidProfile: SolidProfile = {
  profileAddress: guestWebId,
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

describe("useGuest", () => {
  test("Ideal circumstances return expected data", async () => {
    const rdfFields = TestGuestFields.map((field) => field.rdfName);
    const { result, waitForNextUpdate } = renderHook(() =>
      useGuest(rdfFields, guestWebId)
    );
    await act(async () => {
      await waitForNextUpdate();
    });
    expect(result.error).toBeUndefined();

    const returnValue = result.current;
    expect(returnValue.isLoading).toBeFalsy();
    expect(returnValue.isError).toBeUndefined();

    expect(returnValue.guestFields).toEqual(TestGuestFields);
  });

  test("Only returns queried RDF fields", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useGuest([PersonFieldToRdfMap.firstName], guestWebId)
    );
    await act(async () => {
      await waitForNextUpdate();
    });
    expect(result.error).toBeUndefined();

    const returnValue = result.current;
    expect(returnValue.isLoading).toBeFalsy();
    expect(returnValue.isError).toBeUndefined();

    expect(returnValue.guestFields).toEqual([TestGuestFields[0]]);
  });

  test("Null guest profile doesn't return data", async () => {
    (GetProfileOf as jest.Mock).mockImplementation(async () => {
      return {
        profileAddress: guestWebId,
        profile: null,
        dataSet: null,
      };
    });
    const { result, waitForNextUpdate } = renderHook(() =>
      useGuest([PersonFieldToRdfMap.firstName], guestWebId)
    );
    await act(async () => {
      await waitForNextUpdate();
    });
    expect(result.error).toBeUndefined();

    const returnValue = result.current;
    expect(returnValue.isLoading).toBeTruthy();
    expect(returnValue.isError).toBeUndefined();
    expect(returnValue.guestFields).toBeUndefined();
  });

  test("With no WebId passed, it returns profile fields of default session", async () => {
    const expectedGuestFields: Field[] = [
      {
        fieldShortName: "firstName",
        fieldPrettyName: "First name",
        fieldValue: "Sam",
        rdfName: PersonFieldToRdfMap["firstName"],
        datatype: xmlSchemaTypes.string,
      },
    ];

    let thing = createThing({ name: guestWebId });
    thing = addStringNoLocale(thing, PersonFieldToRdfMap.firstName, "Sam");
    (GetProfile as jest.Mock).mockImplementation(async () => {
      return {
        profileAddress: guestWebId,
        profile: thing,
        dataSet: null,
      };
    });

    const { result, waitForNextUpdate } = renderHook(() =>
      useGuest([PersonFieldToRdfMap.firstName])
    );
    await act(async () => {
      await waitForNextUpdate();
    });
    expect(result.error).toBeUndefined();

    const returnValue = result.current;
    expect(returnValue.isLoading).toBeFalsy();
    expect(returnValue.isError).toBeUndefined();

    expect(returnValue.guestFields).toEqual(expectedGuestFields);
  });

  test("RevalidateGuest calls mutate with the correct key", async () => {
    const swr = await import("swr");
    const mockMutate = jest.spyOn(swr, "mutate");

    RevalidateGuest(
      [PersonFieldToRdfMap.firstName, PersonFieldToRdfMap.lastName],
      "TestWebId"
    );

    expect(mockMutate).toBeCalledWith([
      "guest",
      `${PersonFieldToRdfMap.firstName},${PersonFieldToRdfMap.lastName}`,
      "TestWebId",
    ]);
  });

  test("TriggerRefetchGuest calls mutate with the correct key", async () => {
    const swr = await import("swr");
    const mockMutate = jest.spyOn(swr, "mutate");

    const newFields: Field[] = [
      {
        fieldShortName: "firstName",
        fieldPrettyName: "First name",
        fieldValue: "John",
        rdfName: PersonFieldToRdfMap["firstName"],
        datatype: xmlSchemaTypes.string,
      },
      {
        fieldShortName: "lastName",
        fieldPrettyName: "Last name",
        fieldValue: "Smith",
        rdfName: PersonFieldToRdfMap["lastName"],
        datatype: xmlSchemaTypes.string,
      },
    ];

    const rdfFields = newFields.map((field) => field.rdfName);
    TriggerRefetchGuest(rdfFields, newFields, "TestWebId");

    expect(mockMutate).toBeCalledWith([
      "guest",
      `${PersonFieldToRdfMap.firstName},${PersonFieldToRdfMap.lastName}`,
      "TestWebId",
    ]);
  });
});
