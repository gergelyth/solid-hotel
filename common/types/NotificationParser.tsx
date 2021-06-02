import { SolidDataset } from "@inrupt/solid-client";
import { NextRouter } from "next/router";

export type NotificationParser = (
  router: NextRouter,
  url: string,
  dataset: SolidDataset
) => {
  text: string;
  onClick: (event: React.MouseEvent<EventTarget>) => void;
  onReceive: () => void;
};
