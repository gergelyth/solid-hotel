import { LinearProgress, Box } from "@material-ui/core";
import React, { Dispatch, SetStateAction, useState } from "react";

/**
 * @returns A component with an indefinite loading indicator and the optional text of the SWR key.
 */
export function LoadingIndicator(): JSX.Element {
  return (
    <Box display="flex" alignItems="center" mx={1}>
      <Box width="100%" mr={1}>
        <LinearProgress />
      </Box>
      {/* Uncomment this for debugging to see which SWR hook is validating */}
      {/* <Box minWidth={100}>
        <Typography variant="body2" color="textSecondary">
          {swrKey}
        </Typography>
      </Box> */}
    </Box>
  );
}

const loadingIndicators: { [swrKey: string]: JSX.Element } = {};

/**
 * Adds a loading indicator with the specified SWR key if it's not currently present already.
 */
export function AddLoadingIndicator(swrKey: string): void {
  if (swrKey in loadingIndicators) {
    return;
  }

  loadingIndicators[swrKey] = <LoadingIndicator key={swrKey} />;
  forceRender(!render);
}

/**
 * Removes a loading indicator with the specified SWR key if it's currently displayed.
 */
export function RemoveLoadingIndicator(swrKey: string): void {
  if (!(swrKey in loadingIndicators)) {
    return;
  }

  delete loadingIndicators[swrKey];
  forceRender(!render);
}

let render = false;
let forceRender: Dispatch<SetStateAction<boolean>> = () => undefined;

/**
 * Displays indefinite loading indicators for when an SWR hook is currently validating in the background.
 * Optionally shows the key of the SWR hook for better tracking.
 * @returns A component containing all the currently added loading indicators.
 */
export function LoadingIndicators(): JSX.Element {
  //This is a bit of a hack, but having the loadingIndicators as the state doesn't work, because the object doesn't get changed
  [render, forceRender] = useState<boolean>(false);
  return <React.Fragment>{Object.values(loadingIndicators)}</React.Fragment>;
}
