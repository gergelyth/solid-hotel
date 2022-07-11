import { ShowInfoSnackbar, ShowSuccessSnackbar } from "../components/snackbar";
import { Deserialize } from "../setup/testDataDeserializer";
import { Serialize } from "../setup/testDataSerializer";

/** Contains the relative URLs in which application specific items are found in the hotel Pod. These containers are the ones that need to be serialized. */
export const HotelFoldersOfInterest = [
  "bookingrequests/",
  "dataprotection/",
  "hotelprofiles/",
  "privacy/",
  "reservations/",
  "rooms/",
];

/** Contains the relative URLs in which application specific items are found in the guest Pod. These containers are the ones that need to be serialized. */
export const GuestFoldersOfInterest = ["privacy/", "reservations/"];

/**
 * Triggers a download prompt for the ZIP file created by serialization.
 * Helper function - required by the setup functionality.
 */
function DownloadSerializedData(zipName: string, data: Blob | undefined): void {
  if (!data) {
    return;
  }
  const element = document.createElement("a");
  element.href = URL.createObjectURL(data);
  element.download = zipName;
  document.body.appendChild(element);
  element.click();
}

/**
 * Serializes the given folders of interest and prompts a download popup with ZIP file generated.
 * Helper function - required by the setup functionality.
 */
export function GetSerializeFunction(
  zipName: string,
  foldersOfInterest: string[]
): () => void {
  return async () => {
    const closeInfoSnackbar = ShowInfoSnackbar("Serializing pod...", true);
    const data = await Serialize(foldersOfInterest);
    ShowSuccessSnackbar("Pod serialized", closeInfoSnackbar);
    DownloadSerializedData(zipName, data);
  };
}

/**
 * Deserializes the given test data contained in a ZIP file with the passed filename.
 * Helper function - required by the setup functionality.
 */
export function GetDeserializeFunction(filename: string): () => void {
  return async () => {
    const closeInfoSnackbar = ShowInfoSnackbar("Deserializing file...", true);
    await Deserialize(filename);
    ShowSuccessSnackbar("Pod populated", closeInfoSnackbar);
  };
}
