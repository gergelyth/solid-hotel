import ProfileMain from "../../../common/components/profile/profile-main";
import { Button, Grid, Typography, Divider } from "@material-ui/core";
import { useRouter } from "next/router";
import { useRequiredFields } from "../../../common/hooks/useMockApi";
import { RegistrationCard } from "../../components/profile/registration-card";
import { useState } from "react";

function ExportForeignPoliceReport(): void {
  //TODO
}

function ActiveHotelProfileDetail(): JSX.Element {
  const [isRegPopupShowing, setRegPopupVisibility] = useState(false);
  const router = useRouter();

  let guestWebId = router.query.id;
  if (Array.isArray(guestWebId)) {
    guestWebId = guestWebId[0];
  }

  const requiredFields = useRequiredFields(undefined, guestWebId);

  if (!guestWebId) {
    //TODO redirect to 404 instead
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
              setRegPopupVisibility(true);
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
      <RegistrationCard
        rdfFields={requiredFields.data}
        webId={guestWebId}
        isPopupShowing={isRegPopupShowing}
        setPopupVisibility={setRegPopupVisibility}
      />
    </Grid>
  );
}

export default ActiveHotelProfileDetail;
