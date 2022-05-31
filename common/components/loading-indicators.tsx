import { LinearProgress, Box, Typography } from "@material-ui/core";
import React, { useState } from "react";

export function LoadingIndicator({ swrKey }: { swrKey: string }): JSX.Element {
  return (
    <Box display="flex" alignItems="center" mx={1}>
      <Box width="100%" mr={1}>
        <LinearProgress />
      </Box>
      <Box minWidth={100}>
        <Typography variant="body2" color="textSecondary">
          {swrKey}
        </Typography>
      </Box>
    </Box>
  );
}

const loadingIndicators: { [swrKey: string]: JSX.Element } = {};

export function AddLoadingIndicator(swrKey: string): void {
  if (swrKey in loadingIndicators) {
    return;
  }

  loadingIndicators[swrKey] = <LoadingIndicator swrKey={swrKey} />;
  forceRender(!render);
}

export function RemoveLoadingIndicator(swrKey: string): void {
  if (!(swrKey in loadingIndicators)) {
    return;
  }

  delete loadingIndicators[swrKey];
  forceRender(!render);
}

let render = false;
let forceRender: React.Dispatch<React.SetStateAction<boolean>>;

export function LoadingIndicators(): JSX.Element {
  //TODO this is a bit of a hack, but having the loadingIndicators as the state doesn't work, because the object doesn't get changed
  [render, forceRender] = useState<boolean>(false);
  return <React.Fragment>{Object.values(loadingIndicators)}</React.Fragment>;
}
