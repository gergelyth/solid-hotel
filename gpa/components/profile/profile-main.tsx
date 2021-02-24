import { Dispatch, SetStateAction, useState } from "react";
import { useGuest } from "../../hooks/useGuest";
import styles from "../../styles/Home.module.css";
import { Guest, IdDocumentType } from "../../types/Guest";
import ProfileField from "./profile-field";

type Field = {
  fieldName: string;
  fieldValue: string | null;
  setFieldValue: (newValue: string) => void;
};

// TODO: perhaps find something more general for this - probably with Object.entries(guest)
function GetFields(
  guest: Guest,
  setGuest: Dispatch<SetStateAction<Guest>>
): Field[] {
  return [
    {
      fieldName: "First name",
      fieldValue: guest.firstName,
      setFieldValue: (newValue) => {
        guest.firstName = newValue;
        setGuest(guest);
      },
    },
    {
      fieldName: "Last name",
      fieldValue: guest.lastName,
      setFieldValue: (newValue) => {
        guest.lastName = newValue;
        setGuest(guest);
      },
    },
    {
      fieldName: "Nationality",
      fieldValue: guest.nationality,
      setFieldValue: (newValue) => {
        guest.nationality = newValue;
        setGuest(guest);
      },
    },
    {
      fieldName: "Email",
      fieldValue: guest.email,
      setFieldValue: (newValue) => {
        guest.email = newValue;
        setGuest(guest);
      },
    },
    {
      fieldName: "Phone number",
      fieldValue: guest.phoneNumber,
      setFieldValue: (newValue) => {
        guest.phoneNumber = newValue;
        setGuest(guest);
      },
    },
    {
      fieldName: "ID document type",
      fieldValue: IdDocumentType[guest.idDocument?.idDocumentType],
      setFieldValue: (newValue) => {
        guest.idDocument.idDocumentType =
          IdDocumentType[newValue as keyof typeof IdDocumentType];
        setGuest(guest);
      },
    },
    {
      fieldName: "ID document number",
      fieldValue: guest.idDocument?.idDocumentNumber,
      setFieldValue: (newValue) => {
        guest.idDocument.idDocumentNumber = newValue;
        setGuest(guest);
      },
    },
    {
      fieldName: "ID document expiry",
      fieldValue: guest.idDocument?.idDocumentExpiry.toDateString(),
      setFieldValue: (newValue) => {
        guest.idDocument.idDocumentExpiry = new Date(newValue);
        setGuest(guest);
      },
    },
  ];
}

function CreateFieldElements(
  guest: Guest,
  setGuest: Dispatch<SetStateAction<Guest>>
): JSX.Element {
  const fieldElements = GetFields(guest, setGuest);
  return (
    <div>
      <ul>
        {fieldElements.map((item) => {
          return <li key={item.fieldName}>{ProfileField(item)}</li>;
        })}
      </ul>
    </div>
  );
}

function ProfileMain(): JSX.Element {
  const { guest, isLoading, isError } = useGuest();
  const [guestState, setGuestState] = useState({} as Guest);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError || !guest) {
    return (
      <div className={styles.simpleContainer}>
        <div>Error retrieving guest data.</div>
        <div>{isError}</div>
      </div>
    );
  }

  if (Object.keys(guestState).length === 0) {
    setGuestState(guest);
  }

  return (
    <div className={styles.simpleContainer}>
      <h2>
        {guestState?.firstName} {guestState?.lastName}
      </h2>
      {CreateFieldElements(guestState, setGuestState)}
    </div>
  );
}

export default ProfileMain;
