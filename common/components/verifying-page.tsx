import { NextRouter } from "next/router";
import { Box, Button, CircularProgress, Typography } from "@material-ui/core";
import { Dispatch, SetStateAction } from "react";

export enum VerifyingPage {
  Waiting,
  Success,
  NoResponse,
}

function SuccessComponent({ text }: { text: string }): JSX.Element {
  return <Typography variant="h5">{text}</Typography>;
}

function ReturnButton({ router }: { router: NextRouter }): JSX.Element {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => router.push("/")}
    >
      Return to index page
    </Button>
  );
}

function VerifyingComponent({
  successText,
  router,
  currentPage,
  setCurrentPage,
}: {
  successText: string;
  router: NextRouter;
  currentPage: VerifyingPage;
  setCurrentPage: Dispatch<SetStateAction<VerifyingPage>>;
}): JSX.Element | null {
  let waitingPeriod: NodeJS.Timeout | null = null;

  switch (currentPage) {
    case VerifyingPage.Waiting:
      waitingPeriod = setTimeout(
        () => setCurrentPage(VerifyingPage.NoResponse),
        5000
      );
      return (
        <Box>
          <Typography variant="h5">
            Waiting for the hotel to respond...
          </Typography>
          <CircularProgress />
        </Box>
      );

    case VerifyingPage.Success:
      if (waitingPeriod) {
        clearTimeout(waitingPeriod);
      }
      return (
        <Box>
          <SuccessComponent text={successText} />
          <ReturnButton router={router} />
        </Box>
      );

    case VerifyingPage.NoResponse:
      return (
        <Box>
          <Typography variant="h5">No response from the hotel</Typography>
          <Typography variant="h6">
            You will be notified later via the Nofications panel
          </Typography>
          <ReturnButton router={router} />
        </Box>
      );

    default:
      return null;
  }
}

export default VerifyingComponent;
