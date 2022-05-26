import React, { ReactNode } from "react";
import { SWRConfig } from "swr";
import { OnHookErrorFunction } from "../util/helpers";

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
      }}
    >
      {children}
    </SWRConfig>
  );
}
