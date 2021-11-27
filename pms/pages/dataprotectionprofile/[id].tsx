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
    <Typography variant="body1">
      Data protection length: {data.dataProtectionYears} years
    </Typography>
  );
}

function DataProtectionProfileDetail(): JSX.Element | null {
  const router = useRouter();

  let guestWebId = router.query.id;
  if (Array.isArray(guestWebId)) {
    guestWebId = guestWebId[0];
  }

  const dataDetailsRetrieval = useDataProtectionInformation(
    undefined,
    guestWebId
  );

  if (!guestWebId) {
    router.push("/404");
    return null;
  }

  if (dataDetailsRetrieval.isLoading) {
    return <CircularProgress />;
  }

  if (!dataDetailsRetrieval.data || dataDetailsRetrieval.isError) {
    return (
      <Typography variant="body1">
        Error occured during data protection info retrieval
      </Typography>
    );
  }

  return (
    <Grid
      container
      spacing={3}
      justify="center"
      alignItems="stretch"
      direction="column"
    >
      <Grid item container justify="center">
        <GetDataRetentionPeriod
          data={dataDetailsRetrieval.data}
          isLoading={dataDetailsRetrieval.isLoading}
          isError={dataDetailsRetrieval.isError}
        />
      </Grid>
      <Grid item>
        <ProfileMain
          rdfFields={dataDetailsRetrieval.data.dataProtectionFields}
          webId={guestWebId}
          editable={false}
          deletable={false}
          centerJustify={true}
        />
      </Grid>
    </Grid>
  );
}

export default DataProtectionProfileDetail;
