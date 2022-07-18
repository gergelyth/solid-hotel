import "@testing-library/jest-dom";
import { SerializeDataset } from "../../../common/util/__tests__/testUtil";
import {
  createSolidDataset,
  createThing,
  getStringNoLocale,
  setStringNoLocale,
  setThing,
} from "@inrupt/solid-client";
import { GetDataSet } from "../../../common/util/solid";
import { SafeSaveDatasetAt } from "../../../common/util/solid_wrapper";
import {
  GetOwnerAndAnonymizeInMemory,
  SaveInboxAndReturnReservation,
  SetInboxToHotelInboxInMemory,
} from "../pairingRequestUtil";
import { reservationFieldToRdfMap } from "../../../common/vocabularies/rdf_reservation";

jest.mock("../../../common/util/solid", () => {
  return {
    GetDataSet: jest.fn(),
  };
});

jest.mock("../../../common/consts/solidIdentifiers", () => {
  return {
    ...jest.requireActual("../../../common/consts/solidIdentifiers"),
    HotelWebId: "TestHotelWebId",
    RoomDefinitionsUrl: "https://testpodurl.com/rooms/",
  };
});

jest.mock("../../../common/util/solid_profile");
jest.mock("../../../common/util/solid_access");
jest.mock("../../../common/util/solid_wrapper");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("pairingRequestUtil", () => {
  test("SaveInboxAndReturnReservation()", async () => {
    let calledUrl;
    let savedDataset = createSolidDataset();
    (SafeSaveDatasetAt as jest.Mock).mockImplementation(
      async (url, dataset) => {
        calledUrl = url;
        savedDataset = dataset;
      }
    );

    let dataset = createSolidDataset();
    const thing = createThing({ name: "reservation" });
    dataset = setThing(dataset, thing);
    (GetDataSet as jest.Mock).mockReturnValue(dataset);

    await SaveInboxAndReturnReservation(
      "https://testpodurl.com/reservations/reservation1",
      "TestGuestInboxUrl"
    );

    expect(calledUrl).toEqual(
      "https://testpodurl.com/reservations/reservation1"
    );

    const expectedRdf = `<https://inrupt.com/.well-known/sdk-local-node/reservation> <${reservationFieldToRdfMap.inbox}> "TestGuestInboxUrl".
`;
    expect(await SerializeDataset(savedDataset)).toEqual(expectedRdf);
  });

  test("SetInboxToHotelInboxInMemory()", async () => {
    let thing = createThing({ name: "reservation" });
    thing = setStringNoLocale(
      thing,
      reservationFieldToRdfMap.inbox,
      "oldValue"
    );

    const result = SetInboxToHotelInboxInMemory(thing, "TestHotelInboxUrl");

    expect(getStringNoLocale(result, reservationFieldToRdfMap.inbox)).toEqual(
      "TestHotelInboxUrl"
    );
  });

  test("GetOwnerAndAnonymizeInMemory()", async () => {
    let thing = createThing({ name: "reservation" });
    thing = setStringNoLocale(
      thing,
      reservationFieldToRdfMap.owner,
      "TestOwner"
    );

    const { anonymizedReservationThing, hotelProfileOwnerUrl } =
      GetOwnerAndAnonymizeInMemory(thing);

    expect(hotelProfileOwnerUrl).toEqual("TestOwner");
    expect(
      getStringNoLocale(
        anonymizedReservationThing,
        reservationFieldToRdfMap.owner
      )
    ).toEqual("Anonymized");
  });
});
