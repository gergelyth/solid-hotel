import {
  addStringNoLocale,
  createSolidDataset,
  createThing,
  getStringNoLocale,
  getThing,
  setThing,
  SolidDataset,
} from "@inrupt/solid-client";
import { AddNotificationThingToDataset } from "../util/solidCommon";
import { NotificationType } from "../types/NotificationsType";
import { profileModificationRdfMap } from "../vocabularies/notification_payloads/rdf_profileModification";

const thingName = "profileModification";

export function DeserializeProfileModification(dataset: SolidDataset): {
  webId: string;
  fieldModified: string;
  newFieldValue: string;
} {
  const modificationThing = getThing(dataset, `#${thingName}`);
  if (!modificationThing) {
    throw new Error("Modification thing cannot be null");
  }

  const webId = getStringNoLocale(
    modificationThing,
    profileModificationRdfMap.webId
  );
  if (!webId) {
    throw new Error("WebId is null in profile modification notification");
  }

  const fieldModified = getStringNoLocale(
    modificationThing,
    profileModificationRdfMap.fieldModified
  );
  if (!fieldModified) {
    throw new Error(
      "Modified field name is null in profile modification notification"
    );
  }

  const newFieldValue = getStringNoLocale(
    modificationThing,
    profileModificationRdfMap.newFieldValue
  );
  if (!newFieldValue) {
    throw new Error(
      "New field value is null in profile modification notification"
    );
  }

  return { webId, fieldModified, newFieldValue };
}

export function SerializeFailureReport(
  webId: string,
  fieldModified: string,
  newFieldValue: string
): SolidDataset {
  let changeDataset = createSolidDataset();

  let changeThing = createThing({ name: thingName });
  changeThing = addStringNoLocale(
    changeThing,
    profileModificationRdfMap.webId,
    webId
  );
  changeThing = addStringNoLocale(
    changeThing,
    profileModificationRdfMap.fieldModified,
    fieldModified
  );
  changeThing = addStringNoLocale(
    changeThing,
    profileModificationRdfMap.newFieldValue,
    newFieldValue
  );

  changeDataset = setThing(changeDataset, changeThing);
  const notificationDataset = AddNotificationThingToDataset(
    changeDataset,
    NotificationType.ProfileModification
  );

  return notificationDataset;
}
