import { useRooms } from "../../../common/hooks/useRooms";
import { RoomDefinitionsUrl } from "../../../common/consts/solidIdentifiers";
import { RoomDefinition } from "../../../common/types/RoomDefinition";
import {
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@material-ui/core";

function EmptyDescription(): JSX.Element {
  return <i>No description</i>;
}

function CreateRoomElement(room: RoomDefinition | null): JSX.Element {
  if (!room) {
    return (
      <Grid item>
        <Typography>Empty room.</Typography>
      </Grid>
    );
  }

  return (
    <Grid
      container
      spacing={1}
      justify="center"
      alignItems="center"
      direction="column"
    >
      <Grid item>
        <Typography>Name: {room.name}</Typography>
      </Grid>
      <Grid item>
        <Typography>{room.description ?? EmptyDescription()}</Typography>
      </Grid>
    </Grid>
  );
}

//TODO this is the same logic as reservation-list in common
function RoomElements(): JSX.Element {
  const { items, isLoading, isError } = useRooms(RoomDefinitionsUrl);

  if (isLoading) {
    return <CircularProgress />;
  }
  if (isError || !items) {
    return (
      <Container maxWidth="sm">
        <Typography>An error occurred.</Typography>
        <Typography>{isError}</Typography>
      </Container>
    );
  }

  const isArrayNonEmpty =
    items.length > 0 && items.some((item) => item !== null);

  return isArrayNonEmpty ? (
    <Grid
      container
      spacing={4}
      justify="center"
      alignItems="center"
      direction="column"
    >
      {items.map((item) => CreateRoomElement(item))}
    </Grid>
  ) : (
    <Typography>No rooms found.</Typography>
  );
}

function RoomSelector(): JSX.Element {
  return (
    <div>
      <RoomElements />
    </div>
  );
}

export default RoomSelector;
