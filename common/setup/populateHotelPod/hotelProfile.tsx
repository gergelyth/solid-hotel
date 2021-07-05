import { hotelFieldToRdfMap } from "../../vocabularies/rdf_hotel";
import { SetHotelProfileField } from "../../../pms/util/solidHotelSpecific";
import {
  HotelAddress,
  HotelLocation,
  HotelName,
} from "../../consts/hotelConsts";

export default async function SetupHotelProfile(): Promise<void> {
  await Promise.all([
    SetHotelProfileField(hotelFieldToRdfMap.name, HotelName),
    //TODO this should be an RDF name (potentially namednode)
    SetHotelProfileField(hotelFieldToRdfMap.location, HotelLocation),
    SetHotelProfileField(hotelFieldToRdfMap.address, HotelAddress),
  ]);
}
