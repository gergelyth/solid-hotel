import { ReverseRecord } from "../util/helpers";

/** A vocabulary map defining the country code to country RDF mapping. */
export const CountryToRdfMap: Record<string, string> = {
  FRA: "https://publications.europa.eu/resource/authority/country/FRA",
  GBR: "https://publications.europa.eu/resource/authority/country/GBR",
  ESP: "https://publications.europa.eu/resource/authority/country/ESP",
  DNK: "https://publications.europa.eu/resource/authority/country/DNK",
  AUS: "https://publications.europa.eu/resource/authority/country/AUS",
};

/** A vocabulary map defining a reverse mapping so we can look up RDF properties and map them to the supported country. */
export const ReverseCountryToRdfMap = ReverseRecord(CountryToRdfMap);
