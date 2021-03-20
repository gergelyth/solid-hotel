import { Dispatch, SetStateAction, useState } from "react";
import { Revalidate } from "../../../common/hooks/useRooms";
import styles from "../../../common/styles/Home.module.css";
import { RoomDefinition } from "../../../common/types/RoomDefinition";
import { CreateOrUpdateRoom } from "../../../common/util/solidhoteladmin";

function EditRoomPopup({
  room,
  updateRoomLocally,
  isPopupShowing,
  setPopupVisibility,
}: {
  room: RoomDefinition;
  updateRoomLocally: (
    newRoomDefinition: RoomDefinition,
    isDelete: boolean
  ) => void;
  isPopupShowing: boolean;
  setPopupVisibility: Dispatch<SetStateAction<boolean>>;
}): JSX.Element | null {
  const [currentRoomName, setRoomName] = useState(room.name ?? "");
  const [currentRoomDescription, setRoomDescription] = useState(
    room.description ?? ""
  );
  if (!isPopupShowing) {
    return null;
  }

  return (
    <div className={`${styles.simpleContainer} ${styles.popup}`}>
      <div className={`${styles.simpleContainer} ${styles.popup_inner}`}>
        <strong>Name:</strong>
        <textarea
          value={currentRoomName}
          onChange={(event) => {
            setRoomName(event.target.value);
          }}
        />
        <strong>Description:</strong>
        <textarea
          value={currentRoomDescription}
          onChange={(event) => {
            setRoomDescription(event.target.value);
          }}
        />
        <div className={`${styles.horizontalContainer}`}>
          <button onClick={() => setPopupVisibility(false)}>Cancel</button>
          <button
            onClick={() => {
              const newRoom = {
                id: room.id,
                name: currentRoomName,
                description:
                  currentRoomDescription === ""
                    ? undefined
                    : currentRoomDescription,
              };
              updateRoomLocally(newRoom, false);
              CreateOrUpdateRoom(newRoom);
              Revalidate();
              setPopupVisibility(false);
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditRoomPopup;
