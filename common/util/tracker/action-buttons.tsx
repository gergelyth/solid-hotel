import { Grid, Button } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

function SendButton({
  isSendButtonDisabled,
  requiresApproval,
  label,
  approveButtonAction,
}: {
  isSendButtonDisabled: boolean;
  requiresApproval: boolean;
  label: string;
  approveButtonAction: () => void;
}): JSX.Element | null {
  if (!requiresApproval) {
    return null;
  }
  return (
    <Grid item>
      <Button
        data-testid="send-button"
        variant="contained"
        color="primary"
        className={"button"}
        disabled={isSendButtonDisabled}
        startIcon={<CheckCircleIcon />}
        onClick={() => {
          approveButtonAction();
        }}
      >
        {label}
      </Button>
    </Grid>
  );
}

export function SendChangeActionButtons({
  isSendButtonDisabled,
  requiresApproval,
  label,
  approveButtonAction,
  closeSnackbar,
}: {
  isSendButtonDisabled: boolean | undefined;
  requiresApproval: boolean;
  label: string;
  approveButtonAction: () => void;
  closeSnackbar: () => void;
}): JSX.Element | null {
  if (isSendButtonDisabled === undefined) {
    return null;
  }
  return (
    <Grid
      item
      container
      justifyContent="center"
      alignItems="center"
      spacing={4}
    >
      <Grid item>
        <Button
          data-testid="cancel-button"
          variant="contained"
          color="secondary"
          onClick={() => {
            closeSnackbar();
          }}
        >
          {requiresApproval ? "Cancel" : "OK"}
        </Button>
      </Grid>
      <SendButton
        isSendButtonDisabled={isSendButtonDisabled}
        requiresApproval={requiresApproval}
        label={label}
        approveButtonAction={approveButtonAction}
      />
    </Grid>
  );
}
