import { SolidDataset } from "@inrupt/solid-client";
import { NextRouter } from "next/router";

/** A helper type which defines the signature of the parser methods used for different notification types. */
export type NotificationParser = (
  router: NextRouter,
  hotelInboxUrl: string,
  dataset: SolidDataset
) => {
  text: string;
  onClick: (event: React.MouseEvent<EventTarget>) => void;
  onReceive: () => void;
};
