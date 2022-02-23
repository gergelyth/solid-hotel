import { useRooms } from "../../hooks/useRooms";
import { RoomDefinitionsUrl } from "../../consts/solidIdentifiers";
import { RoomDefinition } from "../../types/RoomDefinition";
import {
  CircularProgress,
  Container,
  Grid,
  Typography,
  Box,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@material-ui/core";
import { Dispatch, SetStateAction } from "react";

function EmptyDescription(): JSX.Element {
  return <i>No description</i>;
}

function CreateRoomElement(room: RoomDefinition | null): JSX.Element {
  if (!room) {
    //TODO really shouldn't be nulls here
    return (
      <Grid item>
        <Typography variant="caption">Empty room.</Typography>
      </Grid>
    );
  }

  return (
    <Grid container direction="column">
      <Grid item>
        <Typography variant="h6">{room.name}</Typography>
      </Grid>
      <Grid item>
        <Typography variant="caption">
          {room.description ?? EmptyDescription()}
        </Typography>
      </Grid>
    </Grid>
  );
}

//TODO this is the same logic as reservation-list in common
function RoomElements({
  selectedRoomId,
  setSelectedRoomId,
}: {
  selectedRoomId: string;
  setSelectedRoomId: Dispatch<SetStateAction<string>>;
}): JSX.Element {
  //TODO hardcoded room defition url here - is that an issue?
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
    <Box px={2}>
      <FormControl>
        <RadioGroup
          value={selectedRoomId}
          onChange={(e, newValue) => setSelectedRoomId(newValue)}
        >
          <Grid container spacing={2} direction="column">
            {items.map((item) => (
              <Grid item key={item?.id}>
                <FormControlLabel
                  disabled={!item}
                  value={item?.id}
                  control={<Radio />}
                  label={CreateRoomElement(item)}
                />
              </Grid>
            ))}
          </Grid>
        </RadioGroup>
      </FormControl>
    </Box>
  ) : (
    <Typography variant="h6">No rooms found.</Typography>
  );
}

function RoomSelector({
  selectedRoomId,
  setSelectedRoomId,
}: {
  selectedRoomId: string;
  setSelectedRoomId: Dispatch<SetStateAction<string>>;
}): JSX.Element {
  return (
    <div>
      <RoomElements
        selectedRoomId={selectedRoomId}
        setSelectedRoomId={setSelectedRoomId}
      />
    </div>
  );
}

export default RoomSelector;
