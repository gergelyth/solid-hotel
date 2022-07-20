import { useRooms } from "../../hooks/useRooms";
import { RoomDefinitionsUrl } from "../../consts/solidIdentifiers";
import { RoomDefinition } from "../../types/RoomDefinition";
import {
  CircularProgress,
  Grid,
  Typography,
  Box,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@material-ui/core";
import { Dispatch, SetStateAction } from "react";
import { ErrorComponent } from "../error-component";

/**
 * Returns an empty description if required.
 */
function EmptyDescription(): JSX.Element {
  return <i>No description</i>;
}

/**
 * Displays one room definition item with name and description.
 */
function CreateRoomElement(room: RoomDefinition | null): JSX.Element {
  if (!room) {
    return (
      <Grid item>
        <Typography variant="caption">Empty room definition</Typography>
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
/**
 * The list of rooms where selection is driven by radio logic.
 */
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
    return <ErrorComponent />;
  }

  const isArrayNonEmpty =
    items.length > 0 && items.some((item) => item !== null);

  return isArrayNonEmpty ? (
    <Box px={2}>
      <FormControl data-testid="room-selector-radio">
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

/**
 * Allows the radio-logic driven selection of a room.
 * @returns A list of rooms retrieved from the hotel's Solid Pod, with the first one selected as default and allows the user to change the selection.
 */
export function RoomSelector({
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
