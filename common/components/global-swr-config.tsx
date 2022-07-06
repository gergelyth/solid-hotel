import React, { ReactNode } from "react";
import { SWRConfig } from "swr";
import { OnHookErrorFunction } from "../util/helpers";

/**
 * Contains common properties used by all SWR hooks.
 * @returns An SWRConfig config containing the options.
 */
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
