import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { HotelDetails } from "../../../types/HotelDetails";
import {
  GetHotelInformation,
  HotelDetailsOneLiner,
  HotelDetailsTwoLiner,
} from "../hotel-details";

const testHotelDetails: HotelDetails = {
  webId: "HotelWebId",
  name: "Paradise Hotel",
  //TODO a NamedNode of the country?
  location: "France",
  address: "FranceAddress",
};

jest.mock("../../../hooks/useHotel", () => {
  return {
    useHotel: () => {
      return {
        hotelDetails: testHotelDetails,
        isLoading: false,
        isError: false,
      };
    },
  };
});

describe("<HotelDetailsTwoLiner />, <HotelDetailsOneLiner />, GetHotelInformation()", () => {
  test("<HotelDetailsTwoLiner /> renders correctly and displays hotel information", async () => {
    const hotelDetailsComponent = render(
      <HotelDetailsTwoLiner hotelWebId={testHotelDetails.webId} />
    );
    expect(hotelDetailsComponent).toBeDefined();
    expect(
      hotelDetailsComponent.baseElement.innerHTML.includes(
        "Paradise Hotel, France"
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
        "Paradise Hotel, France"
      )
    ).toBeTruthy();
  });

  test("GetHotelInformation() returns hotel information", async () => {
    const hotelInformation = GetHotelInformation(testHotelDetails.webId);
    expect(hotelInformation).toEqual("Paradise Hotel, France");
  });
});
