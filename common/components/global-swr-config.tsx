import React, { ReactNode } from "react";
import { SWRConfig } from "swr";
import { OnHookErrorFunction } from "../util/helpers";
import {
  AddLoadingIndicator,
  RemoveLoadingIndicator,
} from "./loading-indicators";

export default function GlobalSwrConfig({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <SWRConfig
      value={{
        onError: OnHookErrorFunction,
        //10 seconds
        refreshInterval: 10000,
        //this allows us to call a function every time something is loading
        //TODO will this trigger even when validating?
        loadingTimeout: 1,
        onLoadingSlow: (swrKey) => AddLoadingIndicator(swrKey),
        onSuccess: (data, swrKey) => RemoveLoadingIndicator(swrKey),
      }}
    >
      {children}
    </SWRConfig>
  );
}
