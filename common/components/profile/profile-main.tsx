import { useGuest } from "../../hooks/useGuest";
import ProfileField from "./profile-field";
import {
  Grid,
  Typography,
  Container,
  Box,
  CircularProgress,
} from "@material-ui/core";
import { Field } from "../../types/Field";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import { GuestFullName } from "./guest-full-name";

function CreateFieldElements(
  guestFields: Field[],
  rdfFields: string[] | undefined,
  editable: boolean,
  deletable: boolean,
  centerJustify: boolean,
  forceRender?: () => void,
  webId?: string
): JSX.Element {
  return (
    <Grid
      container
      spacing={3}
      justify="center"
      alignItems="center"
      direction="column"
    >
      {guestFields.map((item) => {
        return (
          <ProfileField
            key={item.fieldShortName}
            field={item}
            guestFields={guestFields}
            rdfFields={rdfFields}
            editable={editable}
            deletable={deletable}
            centerJustify={centerJustify}
            forceRender={forceRender}
            webId={webId}
          />
        );
      })}
    </Grid>
  );
}

//TODO if we want to tackle the disappearing fields issue
// function ProfileRenderableComponent({
//   guestFields,
//   rdfFields,
//   editable,
//   deletable,
//   centerJustify,
//   forceRender,
//   webId,
// }: {
//   guestFields: Field[];
//   rdfFields: string[] | undefined;
//   editable: boolean;
//   deletable: boolean;
//   centerJustify: boolean;
//   forceRender?: () => void;
//   webId?: string;
// }): JSX.Element {
//   const [guestFieldsState, setGuestFieldsState] = useState(guestFields);
//   const render = (newGuestFields: Field[]): void => {
//     setGuestFieldsState(newGuestFields);
//   };
// }

function ProfileMain({
  rdfFields,
  webId,
  editable = true,
  deletable = true,
  centerJustify = false,
  forceRender,
}: {
  rdfFields: string[] | undefined;
  webId?: string;
  editable?: boolean;
  deletable?: boolean;
  centerJustify?: boolean;
  forceRender?: () => void;
}): JSX.Element {
  const { guestFields, isLoading, isError } = useGuest(rdfFields, webId);

  if (isLoading) {
    return <CircularProgress />;
  }
  if (isError || !guestFields) {
    return (
      <Container maxWidth="sm">
        <Typography>Error retrieving guest data.</Typography>
        <Box>{isError}</Box>
      </Container>
    );
  }

  return (
    // <ProfileRenderableComponent
    //   guestFields={guestFields}
    //   rdfFields={rdfFields}
    //   editable={editable}
    //   deletable={deletable}
    //   centerJustify={centerJustify}
    //   forceRender={forceRender}
    //   webId={webId}
    // />
    <Grid
      container
      spacing={3}
      justify="center"
      alignItems="stretch"
      direction="column"
    >
      <Grid
        item
        container
        spacing={1}
        justify="center"
        alignItems="center"
        direction="row"
      >
        <Grid item>
          <AccountBoxIcon style={{ fontSize: 80 }} />
        </Grid>
        <Grid item>
          <GuestFullName guestFields={guestFields} />
        </Grid>
      </Grid>
      <Grid item>
        {CreateFieldElements(
          guestFields,
          rdfFields,
          editable,
          deletable,
          centerJustify,
          forceRender,
          webId
        )}
      </Grid>
    </Grid>
  );
}

export default ProfileMain;
