import { useGuest } from "../../hooks/useGuest";
import styles from "../../styles/Home.module.css";
import { Guest, IdDocumentType } from "../../types/Guest";
import ProfileField from "./profile-field";

type Field = {
  fieldName: string;
  fieldValue: string | null;
};

// TODO: perhaps find something more general for this
function GetFields(guest: Guest): Field[] {
  return [
    {
      fieldName: "First name",
      fieldValue: guest.firstName,
    },
    {
      fieldName: "Last name",
      fieldValue: guest.lastName,
    },
    {
      fieldName: "Nationality",
      fieldValue: guest.nationality,
    },
    {
      fieldName: "Email",
      fieldValue: guest.email,
    },
    {
      fieldName: "Phone number",
      fieldValue: guest.phoneNumber,
    },
    {
      fieldName: "ID document type",
      fieldValue: IdDocumentType[guest.idDocument.idDocumentType],
    },
    {
      fieldName: "ID document number",
      fieldValue: guest.idDocument.idDocumentNumber,
    },
    {
      fieldName: "ID document expiry",
      fieldValue: guest.idDocument.idDocumentExpiry.toDateString(),
    },
  ];
}

function CreateFieldElements(guest: Guest): JSX.Element {
  const fieldElements = GetFields(guest);
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
  return (
    <div className={styles.simpleContainer}>
      <h2>
        {guest?.firstName} {guest?.lastName}
      </h2>
      {CreateFieldElements(guest)}
    </div>
  );
}

export default ProfileMain;
