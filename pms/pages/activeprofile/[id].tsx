import ProfileMain from "../../../common/components/profile/profile-main";
import { Button, Grid, Typography, Divider } from "@material-ui/core";
import { useRouter } from "next/router";
import { useRequiredFields } from "../../../common/hooks/useMockApi";

function PrintRegistrationCard(): void {
  //TODO
}

function ExportForeignPoliceReport(): void {
  //TODO
}

function ActiveHotelProfileDetail(): JSX.Element {
  const router = useRouter();

  let guestWebId = router.query.id;
  if (Array.isArray(guestWebId)) {
    guestWebId = guestWebId[0];
  }

  const requiredFields = useRequiredFields(undefined, guestWebId);

  if (!guestWebId) {
    return <Typography variant="body1">Owner ID null</Typography>;
  }

  return (
    <Grid
      container
      spacing={3}
      justify="center"
      alignItems="center"
      direction="row"
    >
      <Grid item xs={5}>
        <ProfileMain
          rdfFields={requiredFields.data}
          webId={guestWebId}
          editable={true}
          deletable={false}
        />
      </Grid>
      <Divider orientation="vertical" flexItem />
      <Grid
        item
        xs={5}
        container
        spacing={3}
        justify="center"
        alignItems="center"
        direction="column"
      >
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              PrintRegistrationCard();
            }}
          >
            Print registration card
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              ExportForeignPoliceReport();
            }}
          >
            Export foreign police report
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ActiveHotelProfileDetail;
