import RoomList from "../components/rooms/room-list";
import { Grid, Typography } from "@material-ui/core";

function RoomManagement(): JSX.Element {
  return (
    <Grid
      container
      spacing={5}
      justify="center"
      alignItems="center"
      direction="column"
    >
      <Grid item>
        <Typography variant="h4">Room management</Typography>
      </Grid>

      <Grid item>
        <RoomList />
      </Grid>
    </Grid>
  );
}

export default RoomManagement;
