import "@testing-library/jest-dom";
import {
  CreateInboxUrlFromReservationId,
  CreateReservationUrlFromReservationId,
  GetCoreFolderFromWebId,
  GetCoreReservationFolderFromInboxUrl,
  GetCoreReservationFolderFromReservationUrl,
  GetIdFromDatasetUrl,
  GetInboxUrlFromReservationUrl,
  GetReservationIdFromInboxUrl,
  GetReservationUrlFromInboxUrl,
} from "../urlParser";

jest.mock("../solid_reservations", () => {
  return {
    GetUserReservationsPodUrl: jest.fn(
      () => "https://testpodurl.com/reservations/"
    ),
  };
});

describe("urlParser", () => {
  test("GetReservationIdFromInboxUrl returns correct string", async () => {
    const result = GetReservationIdFromInboxUrl(
      "https://testpodurl.com/reservations/11111111/inbox/"
    );
    expect(result).toEqual("11111111");
  });

  test("CreateInboxUrlFromReservationId returns correct string", async () => {
    const result = CreateInboxUrlFromReservationId("11111111");
    expect(result).toEqual(
      "https://testpodurl.com/reservations/11111111/inbox"
    );
  });

  test("CreateReservationUrlFromReservationId returns correct string", async () => {
    const result = CreateReservationUrlFromReservationId("11111111");
    expect(result).toEqual(
      "https://testpodurl.com/reservations/11111111/reservation"
    );
  });

  test("GetCoreReservationFolderFromInboxUrl returns correct string", async () => {
    const result = GetCoreReservationFolderFromInboxUrl(
      "https://testpodurl.com/reservations/11111111/inbox"
    );
    expect(result).toEqual("https://testpodurl.com/reservations/11111111/");
  });

  test("GetCoreReservationFolderFromReservationUrl returns correct string", async () => {
    const result = GetCoreReservationFolderFromReservationUrl(
      "https://testpodurl.com/reservations/11111111/reservation"
    );
    expect(result).toEqual("https://testpodurl.com/reservations/11111111/");
  });

  test("GetInboxUrlFromReservationUrl returns correct string", async () => {
    const result = GetInboxUrlFromReservationUrl(
      "https://testpodurl.com/reservations/11111111/reservation"
    );
    expect(result).toEqual(
      "https://testpodurl.com/reservations/11111111/inbox"
    );
  });

  test("GetReservationUrlFromInboxUrl returns correct string", async () => {
    const result = GetReservationUrlFromInboxUrl(
      "https://testpodurl.com/reservations/11111111/inbox"
    );
    expect(result).toEqual(
      "https://testpodurl.com/reservations/11111111/reservation"
    );
  });

  test("GetIdFromDatasetUrl returns correct strings", async () => {
    const reservationResult = GetIdFromDatasetUrl(
      "https://testpodurl.com/reservations/11111111/reservation",
      1
    );
    expect(reservationResult).toEqual("11111111");

    const roomResult = GetIdFromDatasetUrl(
      "https://testpodurl.com/rooms/22222222",
      0
    );
    expect(roomResult).toEqual("22222222");
  });

  test("GetCoreFolderFromWebId returns correct string", async () => {
    const result = GetCoreFolderFromWebId(
      "https://testpodurl.com/profile/card#me"
    );
    expect(result).toEqual("https://testpodurl.com/");
  });
});
