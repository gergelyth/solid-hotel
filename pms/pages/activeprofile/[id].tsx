import ProfileMain from "../../../common/components/profile/profile-main";
import { Button, Grid } from "@material-ui/core";
import { useRouter } from "next/router";
import { HotelProfilesUrl } from "../../../common/consts/solidIdentifiers";
import { ConstructWebIdFromProfileId } from "../../util/hotelProfileHandler";
import { useRequiredFields } from "../../../common/hooks/useMockApi";

function PrintRegistrationCard(): void {
  //TODO
}

function ExportForeignPoliceReport(): void {
  //TODO
}

function ActiveHotelProfileDetail(): JSX.Element {
  const router = useRouter();

  //TODO this ID should be the "owner" field of the reservation minus the HotelProfilesUrl
  let profileId = router.query.id;
  if (Array.isArray(profileId)) {
    profileId = profileId[0];
  }

  if (!profileId) {
    throw new Error("Profile ID null");
  }

  const guestWebId = ConstructWebIdFromProfileId(HotelProfilesUrl, profileId);

  const requiredFields = useRequiredFields();

  return (
    <Grid
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
      <Grid item>
        <ProfileMain
          rdfFields={requiredFields.data}
          webId={guestWebId}
          editable={true}
          deletable={false}
        />
      </Grid>
    </Grid>
  );
}

export default ActiveHotelProfileDetail;
