import "@testing-library/jest-dom";
import {
  SerializeDataset,
  TestRoomDefinitions,
} from "../../../common/util/__tests__/testUtil";
import { createSolidDataset } from "@inrupt/solid-client";
import { GetDataSet } from "../../../common/util/solid";
import {
  CreateOrUpdateRoom,
  DeleteRoom,
  SetHotelProfileField,
} from "../solidHotelSpecific";
import {
  GetProfileOf,
  SetFieldInSolidProfile,
} from "../../../common/util/solid_profile";
import {
  SafeCreateContainerAt,
  SafeDeleteDataset,
  SafeSaveDatasetInContainer,
} from "../../../common/util/solid_wrapper";
import { roomFieldToRdfMap } from "../../../common/vocabularies/rdf_room";
import { SetReadAccessToEveryone } from "../../../common/util/solid_access";

jest.mock("../../../common/util/solid", () => {
  return {
    GetDataSet: jest.fn(),
  };
});

jest.mock("../../../common/consts/solidIdentifiers", () => {
  return {
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

describe("solidHotelSpecific", () => {
  test("SetHotelProfileField()", async () => {
    (GetProfileOf as jest.Mock).mockReturnValue(jest.fn());
    await SetHotelProfileField("test:property", "newValue");

    expect(SetFieldInSolidProfile).toBeCalledWith(
      expect.anything(),
      "test:property",
      "newValue"
    );
  });

  test("CreateOrUpdateRoom() doesn't create room container if it can successfully retrieve it", async () => {
    (GetDataSet as jest.Mock).mockReturnValue(createSolidDataset());
    await CreateOrUpdateRoom(TestRoomDefinitions[0]);

    expect(SafeCreateContainerAt).not.toBeCalled();
    expect(SetReadAccessToEveryone).not.toBeCalled();

    const expectedRdf = `<https://inrupt.com/.well-known/sdk-local-node/room> <${roomFieldToRdfMap.name}> "Room 1";
    <${roomFieldToRdfMap.description}> "Description 1".
`;

    expect(GetDataSet).toBeCalledWith("https://testpodurl.com/rooms/");
    expect(SafeSaveDatasetInContainer).toBeCalledWith(
      "https://testpodurl.com/rooms/",
      expect.anything()
    );

    const serializedResult = await SerializeDataset(
      (SafeSaveDatasetInContainer as jest.Mock).mock.calls[0][1]
    );
    expect(serializedResult).toEqual(expectedRdf);
  });

  test("CreateOrUpdateRoom() creates room container if it's missing", async () => {
    (GetDataSet as jest.Mock).mockImplementation(() => {
      throw new Error();
    });
    await CreateOrUpdateRoom(TestRoomDefinitions[0]);

    expect(SafeCreateContainerAt).toBeCalledWith(
      "https://testpodurl.com/rooms/"
    );
    expect(SetReadAccessToEveryone).toBeCalledWith(
      "https://testpodurl.com/rooms/"
    );

    const expectedRdf = `<https://inrupt.com/.well-known/sdk-local-node/room> <${roomFieldToRdfMap.name}> "Room 1";
    <${roomFieldToRdfMap.description}> "Description 1".
`;

    expect(GetDataSet).toBeCalledWith("https://testpodurl.com/rooms/");
    expect(SafeSaveDatasetInContainer).toBeCalledWith(
      "https://testpodurl.com/rooms/",
      expect.anything()
    );

    const serializedResult = await SerializeDataset(
      (SafeSaveDatasetInContainer as jest.Mock).mock.calls[0][1]
    );
    expect(serializedResult).toEqual(expectedRdf);
  });

  test("DeleteRoom()", async () => {
    await DeleteRoom(TestRoomDefinitions[0]);

    expect(SafeDeleteDataset).toBeCalledWith(
      "https://testpodurl.com/rooms/roomId1"
    );
  });
});
