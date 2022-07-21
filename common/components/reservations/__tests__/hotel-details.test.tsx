import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { HotelDetails } from "../../../types/HotelDetails";
import {
  GetHotelInformation,
  HotelDetailsOneLiner,
  HotelDetailsTwoLiner,
} from "../hotel-details";
import { CountryToRdfMap } from "../../../vocabularies/rdfCountries";
import { useHotel } from "../../../hooks/useHotel";

const testHotelDetails: HotelDetails = {
  webId: "HotelWebId",
  name: "Paradise Hotel",
  location: CountryToRdfMap.FRA,
  address: "FranceAddress",
};

jest.mock("../../../hooks/useHotel", () => {
  return {
    useHotel: jest.fn(),
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  (useHotel as jest.Mock).mockReturnValue({
    hotelDetails: testHotelDetails,
    isLoading: false,
    isError: false,
  });
});

describe("<HotelDetailsTwoLiner />, <HotelDetailsOneLiner />, GetHotelInformation()", () => {
  test("<HotelDetailsTwoLiner /> renders correctly and displays hotel information", async () => {
    const hotelDetailsComponent = render(
      <HotelDetailsTwoLiner hotelWebId={testHotelDetails.webId} />
    );
    expect(hotelDetailsComponent).toBeDefined();
    expect(
      hotelDetailsComponent.baseElement.innerHTML.includes(
        `Paradise Hotel, FRA`
      )
    ).toBeTruthy();
    expect(
      hotelDetailsComponent.baseElement.innerHTML.includes("FranceAddress")
    ).toBeTruthy();
  });

  test("<HotelDetailsOneLiner /> renders correctly and displays hotel information", async () => {
    const hotelDetailsComponent = render(
      <HotelDetailsOneLiner hotelWebId={testHotelDetails.webId} />
    );
    expect(hotelDetailsComponent).toBeDefined();
    expect(
      hotelDetailsComponent.baseElement.innerHTML.includes(
        "Paradise Hotel, FRA"
      )
    ).toBeTruthy();
  });

  test("GetHotelInformation() returns hotel information", async () => {
    const hotelInformation = GetHotelInformation(testHotelDetails.webId);
    expect(hotelInformation).toEqual("Paradise Hotel, FRA");
  });
});
