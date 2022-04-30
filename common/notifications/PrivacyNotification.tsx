import { getSourceUrl, SolidDataset } from "@inrupt/solid-client";
import {
  AddNotificationThingToDataset,
  CreateGuestPrivacyTokenDataset,
  CreateHotelPrivacyTokenDataset,
} from "../util/datasetFactory";
import { NotificationType } from "../types/NotificationsType";
import { HotelPrivacyToken } from "../types/HotelPrivacyToken";
import { ConvertToHotelPrivacyToken } from "../hooks/usePrivacyTokens";
import { ConvertToGuestPrivacyToken } from "../hooks/usePrivacyTokens";
import { GuestPrivacyToken } from "../types/GuestPrivacyToken";

//TODO can we improve the methods with generics to avoid duplication?
export function DeserializeHotelPrivacyNotification(
  dataset: SolidDataset
): HotelPrivacyToken {
  const datasetUrl = getSourceUrl(dataset);
  if (!datasetUrl) {
    throw new Error("Dataset URL is null");
  }

  const hotelPrivacyToken = ConvertToHotelPrivacyToken(dataset, datasetUrl);
  if (!hotelPrivacyToken) {
    throw new Error("Hotel privacy token cannot be null");
  }

  return hotelPrivacyToken;
}

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

export function SerializeHotelPrivacyNotification(
  privacyToken: HotelPrivacyToken
): SolidDataset {
  const privacyTokenDataset = CreateHotelPrivacyTokenDataset(privacyToken);

  const notificationDataset = AddNotificationThingToDataset(
    privacyTokenDataset,
    NotificationType.PrivacyToken
  );

  return notificationDataset;
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
