import { act, renderHook } from "@testing-library/react-hooks";
import { GetDataSet } from "../../../util/solid";
import { MockContainer } from "../../../util/__tests__/testUtil";
import { mockSolidDatasetFrom, SolidDataset } from "@inrupt/solid-client";
import { FetchItems } from "../../util/listThenItemsFetcher";

const containerUrl = "https://testpodurl.com/util/";

jest.mock("../../../util/solid", () => {
  return {
    GetDataSet: jest.fn(),
  };
});

const datasetMap: { [url: string]: SolidDataset } = {
  "https://testpodurl.com/util/": MockContainer(
    "https://testpodurl.com/util/",
    ["resource1.ttl", "resource2.ttl"]
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
    MockGetDataSet(datasetMap, url)
  );
  jest.clearAllMocks();
});

afterEach(() => {
  act(() => {
    jest.runAllTimers();
  });
});

describe("listThenItemsFetcher", () => {
  test("Without URL decoration calls GetDataSet and convertToType the correct number of times", async () => {
    const mockConvertToType = jest.fn();
    const { result, waitForNextUpdate } = renderHook(() =>
      FetchItems("TestSwrKey", containerUrl, mockConvertToType)
    );
    await act(async () => {
      await waitForNextUpdate();
    });
    expect(result.error).toBeUndefined();

    const returnValue = result.current;
    expect(returnValue.isLoading).toBeFalsy();
    expect(returnValue.isError).toBeUndefined();

    expect(GetDataSet).toBeCalledTimes(3);
    expect(GetDataSet).toHaveBeenNthCalledWith(1, containerUrl);
    expect(GetDataSet).toHaveBeenNthCalledWith(
      2,
      `${containerUrl}resource1.ttl`
    );
    expect(GetDataSet).toHaveBeenNthCalledWith(
      3,
      `${containerUrl}resource2.ttl`
    );

    expect(mockConvertToType).toBeCalledTimes(2);
  });

  test("With URL decoration calls GetDataSet and convertToType the correct number of times", async () => {
    const mockConvertToType = jest.fn();
    const { result, waitForNextUpdate } = renderHook(() =>
      FetchItems(
        "TestSwrKey",
        containerUrl,
        mockConvertToType,
        (url) => `${url}/decoration`
      )
    );
    await act(async () => {
      await waitForNextUpdate();
    });
    expect(result.error).toBeUndefined();

    const returnValue = result.current;
    expect(returnValue.isLoading).toBeFalsy();
    expect(returnValue.isError).toBeUndefined();

    expect(GetDataSet).toBeCalledTimes(3);
    expect(GetDataSet).toHaveBeenNthCalledWith(1, containerUrl);
    expect(GetDataSet).toHaveBeenNthCalledWith(
      2,
      `${containerUrl}resource1.ttl/decoration`
    );
    expect(GetDataSet).toHaveBeenNthCalledWith(
      3,
      `${containerUrl}resource2.ttl/decoration`
    );

    expect(mockConvertToType).toBeCalledTimes(2);
  });
});
