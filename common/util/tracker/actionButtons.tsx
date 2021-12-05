import { Grid, Button } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

function SendButton({
  isSendButtonDisabled,
  requiresApproval,
}: {
  isSendButtonDisabled: boolean;
  requiresApproval: boolean;
}): JSX.Element | null {
  if (!requiresApproval) {
    return null;
  }
  return (
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
  );
}

export function SendChangeActionButtons({
  isSendButtonDisabled,
  fieldOptions,
  requiresApproval,
}: {
  isSendButtonDisabled: boolean | undefined;
  fieldOptions: { [rdfName: string]: boolean };
  requiresApproval: boolean;
}): JSX.Element | null {
  if (isSendButtonDisabled === undefined) {
    return null;
  }
  return (
    <Grid item container justify="center" alignItems="center" spacing={4}>
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
      <SendButton
        isSendButtonDisabled={isSendButtonDisabled}
        requiresApproval={requiresApproval}
      />
    </Grid>
  );
}
