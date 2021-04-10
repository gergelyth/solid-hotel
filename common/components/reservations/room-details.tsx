import { Box, Typography } from "@material-ui/core";
import { useSpecificRoom } from "../../hooks/useRooms";

function RoomDetails({ roomUrl }: { roomUrl: string }): JSX.Element {
  const { room, isLoading, isError } = useSpecificRoom(roomUrl);

  let roomName: string;
  let roomDescription: string;

  if (isLoading) {
    roomName = "Loading room name...";
    roomDescription = "Loading room description...";
  } else if (isError || !room) {
    roomName = "Error loading room name...";
    roomDescription = "Error loading room description...";
  } else {
    roomName = room.name;
    roomDescription = room.description ?? "<Empty description>";
  }

  return (
    <Box>
      <Typography variant="body2">{roomName}</Typography>
      <Typography variant="body2">{roomDescription}</Typography>
    </Box>
  );
}

export default RoomDetails;
