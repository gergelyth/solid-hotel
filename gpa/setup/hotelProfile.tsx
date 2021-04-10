import { hotelFieldToRdfMap } from "../../common/vocabularies/rdf_hotel";
import { SetHotelProfileField } from "../../common/util/solidhoteladmin";

export default function SetupHotelProfile(): void {
  SetHotelProfileField(hotelFieldToRdfMap.name, "Paradise Hotel");
  //TODO this should be an RDF name (potentially namednode)
  SetHotelProfileField(hotelFieldToRdfMap.location, "Australia");
  console.log("Setup of hotel WebId profile finished.");
}
