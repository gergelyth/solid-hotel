import { NextRouter } from "next/router";
import { Box, Button, Typography } from "@material-ui/core";

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

function SuccessPage({
  successText,
  router,
}: {
  successText: string;
  router: NextRouter;
}): JSX.Element {
  return (
    <Box>
      <SuccessComponent text={successText} />
      <ReturnButton router={router} />
    </Box>
  );
}

export default SuccessPage;
