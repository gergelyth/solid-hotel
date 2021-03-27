import { Dispatch, SetStateAction } from "react";
import { Revalidate } from "../../../common/hooks/useRooms";
import styles from "../../../common/styles/Home.module.css";
import { RoomDefinition } from "../../../common/types/RoomDefinition";
import { DeleteRoom } from "../../../common/util/solidhoteladmin";

function DeleteRoomPopup({
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
  if (!isPopupShowing) {
    return null;
  }

  return (
    <div className={`${styles.simpleContainer} ${styles.popup}`}>
      <div className={`${styles.simpleContainer} ${styles.popup_inner}`}>
        <div>Delete the following room?</div>
        <strong>{room.name}</strong>
        <strong>
          Clicking delete will cancel all reservations made for this room!
        </strong>
        {/* TODO get reservation count */}
        <div>There are currently {} reservations made for this room.</div>
        <div>
          Please confirm that you are sure about executing this deletion.
        </div>
        <div>{/* TODO: checkbox to confirm here */}</div>
        <div className={`${styles.horizontalContainer}`}>
          <button onClick={() => setPopupVisibility(false)}>Cancel</button>
          <button
            onClick={() => {
              // TODO: deleted room doesnt disappear immediately locally!
              updateRoomLocally(room, true);
              DeleteRoom(room);
              Revalidate();
              setPopupVisibility(false);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteRoomPopup;
