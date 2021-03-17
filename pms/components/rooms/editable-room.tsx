import { useState } from "react";
import styles from "../../../common/styles/Home.module.css";
import { RoomDefinition } from "../../../common/types/RoomDefinition";
import EditFieldPopup from "./edit-room-popup";

function EmptyDescription(): JSX.Element {
  return <i>No description</i>;
}

function EditableRoomElement({
  room,
  setRoom,
}: {
  room: RoomDefinition;
  setRoom: (newRoomDefinition: RoomDefinition) => void;
}): JSX.Element {
  const [isEditPopupShowing, setEditPopupVisibility] = useState(false);
  // const [isDeletePopupShowing, setDeletePopupVisibility] = useState(false);
  return (
    <div className={styles.horizontalContainer}>
      <div className={styles.simpleContainer}>
        <h3>Name: {room.name}</h3>
        <p>{room.description ?? EmptyDescription()}</p>
      </div>
      <button onClick={() => setEditPopupVisibility(true)}>Edit</button>
      {/* <button onClick={() => setDeletePopupVisibility(true)}>Delete</button> */}
      <EditFieldPopup
        room={room}
        setRoom={setRoom}
        isPopupShowing={isEditPopupShowing}
        setPopupVisibility={setEditPopupVisibility}
      />
      {/* <DeleteFieldPopup
        fieldName={fieldName}
        setFieldValueInParent={setFieldValue}
        isPopupShowing={isDeletePopupShowing}
        setPopupVisibility={setDeletePopupVisibility}
      /> */}
    </div>
  );
}

export default EditableRoomElement;
