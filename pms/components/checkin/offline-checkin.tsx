import { Button } from "@material-ui/core";

function OfflineCheckinButton(): JSX.Element {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => {
        console.log();
      }}
    >
      Check-in
    </Button>
  );
}

export default OfflineCheckinButton;
