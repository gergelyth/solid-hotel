import { RoomList } from "../components/rooms/room-list";
import { Grid, Typography } from "@material-ui/core";

/**
 * The page displayed for the PMS room management operations.
 * Essentially only a page wrapper for the {@link RoomList} component.
 * @returns The room management page.
 */
function RoomManagement(): JSX.Element {
  return (
    <Grid
      container
      spacing={5}
      justifyContent="center"
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
