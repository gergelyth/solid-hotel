import { getSourceUrl, SolidDataset } from "@inrupt/solid-client";
import {
  AddNotificationThingToDataset,
  CreatePrivacyTokenDataset,
} from "../util/datasetFactory";
import { NotificationType } from "../types/NotificationsType";
import { PrivacyToken } from "../types/PrivacyToken";
import { ConvertToPrivacyToken } from "../hooks/usePrivacyTokens";

export function DeserializePrivacyNotification(
  dataset: SolidDataset
): PrivacyToken {
  const datasetUrl = getSourceUrl(dataset);
  if (!datasetUrl) {
    throw new Error("Dataset URL is null");
  }

  const privacyToken = ConvertToPrivacyToken(dataset, datasetUrl);
  if (!privacyToken) {
    throw new Error("Privacy token cannot be null");
  }

  return privacyToken;
}

export function SerializePrivacyNotification(
  privacyToken: PrivacyToken
): SolidDataset {
  const privacyTokenDataset = CreatePrivacyTokenDataset(privacyToken);
  const notificationDataset = AddNotificationThingToDataset(
    privacyTokenDataset,
    NotificationType.PrivacyToken
  );

  return notificationDataset;
}
