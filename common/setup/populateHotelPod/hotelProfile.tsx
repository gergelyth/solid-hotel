import { hotelFieldToRdfMap } from "../../vocabularies/rdf_hotel";
import { SetHotelProfileField } from "../../util/solidhoteladmin";
import { HotelLocation, HotelName } from "../../consts/hotelConsts";

export default function SetupHotelProfile(): void {
  SetHotelProfileField(hotelFieldToRdfMap.name, HotelName);
  //TODO this should be an RDF name (potentially namednode)
  SetHotelProfileField(hotelFieldToRdfMap.location, HotelLocation);
  console.log("Setup of hotel WebId profile finished.");
}
