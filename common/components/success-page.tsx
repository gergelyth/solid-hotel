import { NextRouter } from "next/router";
import { Box, Button, Grid, Typography } from "@material-ui/core";
import { CheckCircleOutline } from "@material-ui/icons";
import { green } from "@material-ui/core/colors";

/**
 * @returns The custom success text wrapped in a component.
 */
function SuccessComponent({ text }: { text: string }): JSX.Element {
  return <Typography variant="h6">{text}</Typography>;
}

/**
 * @returns The return to the index page button.
 */
function ReturnButton({ router }: { router: NextRouter }): JSX.Element {
  return (
    <Button
      data-testid="return-button"
      variant="contained"
      color="primary"
      onClick={() => router.push("/")}
    >
      Return to index page
    </Button>
  );
}

/**
 * A generic component we can show to the user when something finished/went right.
 * @returns A component with green color dominating displaying the message passed and a return to the index page button.
 */
export function SuccessPage({
  successText,
  router,
}: {
  successText: string;
  router: NextRouter;
}): JSX.Element {
  return (
    <Box border={1} borderRadius={16}>
      <Box
        style={{
          backgroundColor: green[600],
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
        padding={5}
        textAlign="center"
      >
        <CheckCircleOutline style={{ fontSize: "600%", color: "white" }} />
      </Box>
      <Box p={3}>
        <Grid
          container
          spacing={5}
          alignItems="center"
          justifyContent="center"
          direction="column"
        >
          <Grid item>
            <Typography variant="h4" align="center">
              Success
            </Typography>
            <SuccessComponent text={successText} />
          </Grid>
          <Grid item>
            <ReturnButton router={router} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
