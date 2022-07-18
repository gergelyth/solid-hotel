import { createSolidDataset } from "@inrupt/solid-client";
import "@testing-library/jest-dom";
import { pairingTokenToRdfMap } from "../../vocabularies/rdf_pairingToken";
import {
  CreateAndSavePairingToken,
  DeletePairingToken,
  GetPairingToken,
} from "../pairingTokenHandler";
import { GetDataSet } from "../solid";
import { SafeDeleteDataset, SafeSaveDatasetAt } from "../solid_wrapper";
import { DeserializeDataset, SerializeDataset } from "./testUtil";

jest.mock("../solid_wrapper", () => {
  return {
    SafeSaveDatasetAt: jest.fn(),
    SafeDeleteDataset: jest.fn(),
  };
});
jest.mock("../solid", () => {
  return {
    ...jest.requireActual("../solid"),
    GetDataSet: jest.fn(),
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("pairingTokenHandler", () => {
  test("CreateAndSavePairingToken saves the correct token", async () => {
    const jestRandomSpy = jest
      .spyOn(Math, "random")
      .mockReturnValue(0.5098186781001663);

    let calledUrl;
    let savedDataset = createSolidDataset();
    (SafeSaveDatasetAt as jest.Mock).mockImplementation(
      async (url, dataset) => {
        calledUrl = url;
        savedDataset = dataset;
      }
    );

    await CreateAndSavePairingToken(
      "https://testpodurl.com/reservations/11111111/"
    );

    expect(SafeSaveDatasetAt).toBeCalledTimes(1);
    expect(calledUrl).toEqual(
      "https://testpodurl.com/reservations/11111111/pairingToken"
    );

    const expectedRdf = `<https://inrupt.com/.well-known/sdk-local-node/pairingToken> <${pairingTokenToRdfMap.pairingToken}> "0.icq3lx1ui0p".
`;
    const serializedResult = await SerializeDataset(savedDataset);
    expect(serializedResult).toEqual(expectedRdf);

    jestRandomSpy.mockRestore();
  });

  test("GetPairingToken returns the correct token", async () => {
    const rdf = `<https://inrupt.com/.well-known/sdk-local-node/pairingToken> <${pairingTokenToRdfMap.pairingToken}> "0.icq3lx1ui0p".
`;
    const dataset = await DeserializeDataset(rdf);
    (GetDataSet as jest.Mock).mockReturnValue(Promise.resolve(dataset));

    const resultToken = await GetPairingToken(
      "https://testpodurl.com/reservations/11111111/"
    );

    expect(GetDataSet).toBeCalledWith(
      "https://testpodurl.com/reservations/11111111/pairingToken"
    );
    expect(resultToken).toEqual("0.icq3lx1ui0p");
  });

  test("DeletePairingToken calls delete for the correct URL", async () => {
    await DeletePairingToken("https://testpodurl.com/reservations/11111111/");

    expect(SafeDeleteDataset).toBeCalledWith(
      "https://testpodurl.com/reservations/11111111/pairingToken"
    );
  });
});
