import { hotelFieldToRdfMap } from "../../vocabularies/rdf_hotel";
import { SetHotelProfileField } from "../../util/solidhoteladmin";
import {
  HotelAddress,
  HotelLocation,
  HotelName,
} from "../../consts/hotelConsts";

export default function SetupHotelProfile(): void {
  //TODO create inboxes with Poster permissions for everyone - use the new solid-client version API to do this
  //make sure to set the "things in this folder" permission to remove everyone
  SetHotelProfileField(hotelFieldToRdfMap.name, HotelName);
  //TODO this should be an RDF name (potentially namednode)
  SetHotelProfileField(hotelFieldToRdfMap.location, HotelLocation);
  SetHotelProfileField(hotelFieldToRdfMap.address, HotelAddress);
  console.log("Setup of hotel WebId profile finished.");
}
