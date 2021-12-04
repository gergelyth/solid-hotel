import { Grid, Button } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

export function SendChangeActionButtons({
  isSendButtonDisabled,
  fieldOptions,
}: {
  isSendButtonDisabled: boolean | undefined;
  fieldOptions: { [rdfName: string]: boolean };
}): JSX.Element | null {
  if (isSendButtonDisabled === undefined) {
    return null;
  }
  return (
    <Grid
      item
      container
      justify="center"
      alignItems="center"
      spacing={4}
      key="buttons"
    >
      <Grid item>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            //TODO
          }}
        >
          Cancel
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          className={"button"}
          disabled={isSendButtonDisabled}
          startIcon={<CheckCircleIcon />}
          onClick={() => {
            //TODO send the change notification
          }}
        >
          Send selected
        </Button>
      </Grid>
    </Grid>
  );
}
