import ProfileMain from "../../../common/components/profile/profile-main";
import { CircularProgress, Grid, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import { useDataProtectionInformation } from "../../../common/hooks/useMockApi";
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

  let guestWebId = router.query.id;
  if (Array.isArray(guestWebId)) {
    guestWebId = guestWebId[0];
  }

  //TODO probably get rid of IsMatch and list the fields in dataprotectionfields even if it's the same as requiredFields
  const dataDetailsRetrieval = useDataProtectionInformation();

  if (!guestWebId) {
    return <Typography variant="body1">Owner ID null</Typography>;
  }

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
