import { Thing } from "@inrupt/solid-client";
import { NextRouter } from "next/router";

export type NotificationParser = (
  router: NextRouter,
  url: string,
  payloadThing: Thing | null
) => {
  text: string;
  onClick: (event: React.MouseEvent<EventTarget>) => void;
  onReceive: () => void;
};
