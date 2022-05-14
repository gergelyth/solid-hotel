import { ShowInfoSnackbar, ShowSuccessSnackbar } from "../components/snackbar";
import { Deserialize } from "../setup/testDataDeserializer";
import { Serialize } from "../setup/testDataSerializer";

function DownloadSerializedData(data: Blob | undefined): void {
  if (!data) {
    return;
  }
  const element = document.createElement("a");
  element.href = URL.createObjectURL(data);
  element.download = "serialized.zip";
  document.body.appendChild(element);
  element.click();
}

export function GetSerializeFunction(): () => void {
  return async () => {
    ShowInfoSnackbar("Serializing pod...");
    const data = await Serialize();
    ShowSuccessSnackbar("Pod serialized");
    DownloadSerializedData(data);
  };
}

export function GetDeserializeFunction(): () => void {
  return async () => {
    ShowInfoSnackbar("Deserializing file...");
    await Deserialize();
    ShowSuccessSnackbar("Pod populated");
  };
}
