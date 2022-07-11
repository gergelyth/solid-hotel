import { Grid, Button } from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

/**
 * Defines an approval button or null if no approval is required for the send.
 * @returns A button component which triggers the post-approval action on click.
 */
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

/**
 * Defines:
 * - two buttons in case approval is required for the changes to be sent to counterparty (an approve and a cancel button)
 * - one button in case approval is not required (an acknowledging OK button)
 * @returns A component contaning one or two buttons described above.
 */
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
