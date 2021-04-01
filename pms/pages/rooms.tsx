import RoomList from "../components/rooms/room-list";
import { Grid, Typography } from "@material-ui/core";

function RoomManagement(): JSX.Element {
  return (
    <Grid
      container
      spacing={3}
      justify="center"
      alignItems="center"
      direction="column"
    >
      <Grid item>
        <h1>
          <Typography>Room management</Typography>
        </h1>
      </Grid>

      <Grid item>
        <RoomList />
      </Grid>
    </Grid>
  );
}

export default RoomManagement;
