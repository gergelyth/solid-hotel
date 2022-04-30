import { getSourceUrl, SolidDataset } from "@inrupt/solid-client";
import {
  AddNotificationThingToDataset,
  CreateGuestPrivacyTokenDataset,
} from "../util/datasetFactory";
import { NotificationType } from "../types/NotificationsType";
import { ConvertToGuestPrivacyToken } from "../hooks/usePrivacyTokens";
import { GuestPrivacyToken } from "../types/GuestPrivacyToken";

export function DeserializeGuestPrivacyNotification(
  dataset: SolidDataset
): GuestPrivacyToken {
  const datasetUrl = getSourceUrl(dataset);
  if (!datasetUrl) {
    throw new Error("Dataset URL is null");
  }

  const guestPrivacyToken = ConvertToGuestPrivacyToken(dataset, datasetUrl);
  if (!guestPrivacyToken) {
    throw new Error("Guest privacy token cannot be null");
  }

  return guestPrivacyToken;
}

export function SerializeGuestPrivacyNotification(
  privacyToken: GuestPrivacyToken
): SolidDataset {
  const privacyTokenDataset = CreateGuestPrivacyTokenDataset(privacyToken);

  const notificationDataset = AddNotificationThingToDataset(
    privacyTokenDataset,
    NotificationType.PrivacyToken
  );

  return notificationDataset;
}
