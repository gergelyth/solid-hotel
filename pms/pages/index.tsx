import { ShowCustomSnackbar } from "../../common/components/snackbar";
import CheckinProgressSnackbar from "../components/checkin/checkin-progress-snackbar";
import { Button } from "@material-ui/core";

export default function Home(): JSX.Element | null {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => {
        ShowCustomSnackbar((key) => (
          <CheckinProgressSnackbar
            key={key}
            reservationId={"09570fa0-48af-11ec-a883-c7d01e95c64a"}
            guestWebId={"https://gergelyth.inrupt.net/profile/card#me"}
            replyInbox={
              "https://gergelyth.inrupt.net/reservations/02f0e0a0-48af-11ec-a883-c7d01e95c64a/inbox"
            }
          />
        ));
      }}
    >
      Show snackbar
    </Button>
    // <Grid spacing={1} container>
    //   <Grid xs item>
    //     <LinearProgress />
    //   </Grid>
    // </Grid>
  );
}
