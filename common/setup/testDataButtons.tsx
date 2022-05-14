import { ShowInfoSnackbar, ShowSuccessSnackbar } from "../components/snackbar";
import { Deserialize } from "../setup/testDataDeserializer";
import { Serialize } from "../setup/testDataSerializer";

export const HotelFoldersOfInterest = [
  "bookingrequests/",
  "dataprotection/",
  "hotelprofiles/",
  "privacy/",
  "reservations/",
  "rooms/",
];

export const GuestFoldersOfInterest = ["privacy/", "reservations/"];

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

export function GetSerializeFunction(
  zipName: string,
  foldersOfInterest: string[]
): () => void {
  return async () => {
    ShowInfoSnackbar("Serializing pod...");
    const data = await Serialize(foldersOfInterest);
    ShowSuccessSnackbar("Pod serialized");
    DownloadSerializedData(zipName, data);
  };
}

export function GetDeserializeFunction(filename: string): () => void {
  return async () => {
    ShowInfoSnackbar("Deserializing file...");
    await Deserialize(filename);
    ShowSuccessSnackbar("Pod populated");
  };
}
