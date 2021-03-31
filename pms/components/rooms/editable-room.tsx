import { useState } from "react";
import styles from "../../../common/styles/Home.module.css";
import { RoomDefinition } from "../../../common/types/RoomDefinition";
import DeleteRoomPopup from "./delete-room-popup";
import EditRoomPopup from "./edit-room-popup";

function EmptyDescription(): JSX.Element {
  return <i>No description</i>;
}

//TODO same logic as EditableField
function EditableRoomElement({
  room,
  updateRoomLocally,
}: {
  room: RoomDefinition;
  updateRoomLocally: (
    newRoomDefinition: RoomDefinition,
    isDelete: boolean
  ) => void;
}): JSX.Element {
  const [isEditPopupShowing, setEditPopupVisibility] = useState(false);
  const [isDeletePopupShowing, setDeletePopupVisibility] = useState(false);
  return (
    <div className={styles.horizontalContainer}>
      <div className={styles.simpleContainer}>
        <h3>Name: {room.name}</h3>
        <p>{room.description ?? EmptyDescription()}</p>
      </div>
      <button onClick={() => setEditPopupVisibility(true)}>Edit</button>
      <button onClick={() => setDeletePopupVisibility(true)}>Delete</button>
      <EditRoomPopup
        room={room}
        updateRoomLocally={updateRoomLocally}
        isPopupShowing={isEditPopupShowing}
        setPopupVisibility={setEditPopupVisibility}
      />
      <DeleteRoomPopup
        room={room}
        updateRoomLocally={updateRoomLocally}
        isPopupShowing={isDeletePopupShowing}
        setPopupVisibility={setDeletePopupVisibility}
      />
    </div>
  );
}

export default EditableRoomElement;
