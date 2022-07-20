import { act, renderHook } from "@testing-library/react-hooks";
import { GetDataSet } from "../../util/solid";
import { MockContainer } from "../../util/__tests__/testUtil";
import {
  addStringNoLocale,
  createSolidDataset,
  createThing,
  mockSolidDatasetFrom,
  setThing,
  SolidDataset,
} from "@inrupt/solid-client";
import { RoomDefinition } from "../../types/RoomDefinition";
import { RoomFieldToRdfMap } from "../../vocabularies/rdfRoom";
import {
  Revalidate,
  TriggerRefetch,
  useRooms,
  useSpecificRoom,
} from "../useRooms";

const roomTestUrl = "https://testpodurl.com/rooms/";

jest.mock("../../util/solid", () => {
  return {
    ...jest.requireActual("../../util/solid"),
    GetDataSet: jest.fn(),
  };
});

const roomDefinitions: RoomDefinition[] = [
  {
    id: "room1",
    name: "Room1",
    description: "Description1",
  },
  {
    id: "room2",
    name: "Room2",
  },
];

function CreateRoomTestDataset(room: RoomDefinition): SolidDataset {
  const roomDataset = createSolidDataset();

  let newRoom = createThing({ name: "room" });
  newRoom = addStringNoLocale(newRoom, RoomFieldToRdfMap.name, room.name);
  if (room.description) {
    newRoom = addStringNoLocale(
      newRoom,
      RoomFieldToRdfMap.description,
      room.description
    );
  }

  return setThing(roomDataset, newRoom);
}

const roomDatasetMap: { [url: string]: SolidDataset } = {
  "https://testpodurl.com/rooms/": MockContainer(
    "https://testpodurl.com/rooms/",
    ["room1", "room2"]
  ),
  "https://testpodurl.com/rooms/room1": CreateRoomTestDataset(
    roomDefinitions[0]
  ),
  "https://testpodurl.com/rooms/room2": CreateRoomTestDataset(
    roomDefinitions[1]
  ),
};

function MockGetDataSet(
  datasetMap: { [url: string]: SolidDataset },
  url: string
): Promise<SolidDataset> {
  const dataset = datasetMap[url];
  if (dataset) {
    return Promise.resolve(dataset);
  } else {
    return Promise.resolve(mockSolidDatasetFrom(url));
  }
}

beforeEach(() => {
  act(() => {
    jest.useFakeTimers();
  });
  (GetDataSet as jest.Mock).mockImplementation((url) =>
    MockGetDataSet(roomDatasetMap, url)
  );
  jest.clearAllMocks();
});

afterEach(() => {
  act(() => {
    jest.runAllTimers();
  });
});

describe("useRooms", () => {
  test("useRooms returns correct data", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useRooms(roomTestUrl)
    );
    await act(async () => {
      await waitForNextUpdate();
    });
    expect(result.error).toBeUndefined();

    const returnValue = result.current;
    expect(returnValue.isLoading).toBeFalsy();
    expect(returnValue.isError).toBeUndefined();

    expect(GetDataSet).toBeCalledTimes(3);

    expect(returnValue.items).toEqual(roomDefinitions);
  });

  test("useSpecificRoom returns correct data for defined URL", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useSpecificRoom("https://testpodurl.com/rooms/room1")
    );
    await act(async () => {
      await waitForNextUpdate();
    });
    expect(result.error).toBeUndefined();

    const returnValue = result.current;
    expect(returnValue.isLoading).toBeFalsy();
    expect(returnValue.isError).toBeUndefined();

    expect(GetDataSet).toBeCalledTimes(1);

    expect(returnValue.room).toEqual(roomDefinitions[0]);
  });

  test("useSpecificRoom returns undefined for no passed URL", async () => {
    const { result } = renderHook(() => useSpecificRoom(undefined));
    expect(result.error).toBeUndefined();

    const returnValue = result.current;
    expect(returnValue.room).toBeUndefined();
    expect(returnValue.isLoading).toBeTruthy();
    expect(returnValue.isError).toBeUndefined();

    expect(GetDataSet).not.toBeCalled();
  });

  test("Revalidate calls mutate with the correct key", async () => {
    const swr = await import("swr");
    const mockMutate = jest.spyOn(swr, "mutate");

    Revalidate();

    expect(mockMutate).toBeCalledWith("rooms");
  });

  test("TriggerRefetch calls mutate with the correct key", async () => {
    const swr = await import("swr");
    const mockMutate = jest.spyOn(swr, "mutate");

    const newRooms = [
      {
        id: "room3",
        name: "Room3",
        description: "Description3",
      },
    ];

    TriggerRefetch(newRooms);

    expect(mockMutate).toBeCalledWith(
      "rooms",
      [{ description: "Description3", id: "room3", name: "Room3" }],
      false
    );
  });
});
