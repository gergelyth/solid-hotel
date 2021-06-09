import ProfileMain from "../../../common/components/profile/profile-main";
import { CircularProgress, Grid, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import { DataProtectionProfilesUrl } from "../../../common/consts/solidIdentifiers";
import { useDataProtectionInformation } from "../../../common/hooks/useMockApi";
import { ConstructWebIdFromProfileId } from "../../util/hotelProfileHandler";
import { DataProtectionInformation } from "../../../common/util/apiDataRetrieval";

function GetDataRetentionPeriod({
  data,
  isLoading,
  isError,
}: {
  data: DataProtectionInformation | undefined;
  isLoading: boolean;
  isError: boolean;
}): JSX.Element {
  if (isLoading) {
    return <CircularProgress />;
  }

  if (!data || isError) {
    return (
      <Typography variant="body1">Error occured during retrieval</Typography>
    );
  }

  return (
    <Typography variant="body1">{data.dataProtectionYears} years</Typography>
  );
}

function ActiveHotelProfileDetail(): JSX.Element {
  const router = useRouter();

  //TODO this ID should be the "owner" field of the reservation minus the DataProtectionProfilesUrl
  let profileId = router.query.id;
  if (Array.isArray(profileId)) {
    profileId = profileId[0];
  }

  if (!profileId) {
    throw new Error("Profile ID null");
  }

  const guestWebId = ConstructWebIdFromProfileId(
    DataProtectionProfilesUrl,
    profileId
  );

  //TODO probably get rid of IsMatch and list the fields in dataprotectionfields even if it's the same as requiredFields
  const dataDetailsRetrieval = useDataProtectionInformation();

  return (
    <Grid
      container
      spacing={3}
      justify="center"
      alignItems="center"
      direction="column"
    >
      <Grid item>
        <Typography variant="body1">Data protection length:</Typography>
        <GetDataRetentionPeriod
          data={dataDetailsRetrieval.data}
          isLoading={dataDetailsRetrieval.isLoading}
          isError={dataDetailsRetrieval.isError}
        />
      </Grid>
      <Grid item>
        <ProfileMain
          rdfFields={dataDetailsRetrieval.data?.dataProtectionFields}
          webId={guestWebId}
          editable={false}
          deletable={false}
        />
      </Grid>
    </Grid>
  );
}

export default ActiveHotelProfileDetail;
