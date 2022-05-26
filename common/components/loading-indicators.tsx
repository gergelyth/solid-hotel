import { LinearProgress, Box, Typography } from "@material-ui/core";
import React from "react";

function LoadingIndicator({ swrKey }: { swrKey: string }): JSX.Element {
  return (
    <Box display="flex" alignItems="center">
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
  loadingIndicators[swrKey] = <LoadingIndicator swrKey={swrKey} />;
}

export function RemoveLoadingIndicator(swrKey: string): void {
  delete loadingIndicators[swrKey];
}

export function LoadingIndicators(): JSX.Element {
  return <React.Fragment>{loadingIndicators}</React.Fragment>;
}
