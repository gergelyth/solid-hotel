import ProfileMain from "../../../common/components/profile/profile-main";
import { CircularProgress, Grid, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import {
  useDataProtectionInformation,
  useRequiredFields,
} from "../../../common/hooks/useMockApi";
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

function ProfileWrapper({
  guestWebId,
  dataDetailsRetrieval,
  requiredFields,
}: {
  guestWebId: string;
  dataDetailsRetrieval: {
    data: DataProtectionInformation | undefined;
    isLoading: boolean;
    isError: boolean;
  };
  requiredFields: {
    data: string[] | undefined;
    isLoading: boolean;
    isError: boolean;
  };
}): JSX.Element | null {
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

  if (dataDetailsRetrieval.data.dataProtectionFieldsMatch === false) {
    return (
      <ProfileMain
        rdfFields={dataDetailsRetrieval.data.dataProtectionFields}
        webId={guestWebId}
        editable={false}
        deletable={false}
        centerJustify={true}
      />
    );
  }

  if (requiredFields.isLoading) {
    return <CircularProgress />;
  }

  if (!requiredFields.data || requiredFields.isError) {
    return (
      <Typography variant="body1">
        Error occured during required fields retrieval
      </Typography>
    );
  }

  return (
    <ProfileMain
      rdfFields={requiredFields.data}
      webId={guestWebId}
      editable={false}
      deletable={false}
      centerJustify={true}
    />
  );
}

function DataProtectionProfileDetail(): JSX.Element {
  const router = useRouter();

  let guestWebId = router.query.id;
  if (Array.isArray(guestWebId)) {
    guestWebId = guestWebId[0];
  }

  //TODO probably get rid of IsMatch and list the fields in dataprotectionfields even if it's the same as requiredFields
  //in that case we wouldn't need the ProfileWrapper either
  const dataDetailsRetrieval = useDataProtectionInformation(
    undefined,
    guestWebId
  );
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
        <ProfileWrapper
          guestWebId={guestWebId}
          dataDetailsRetrieval={dataDetailsRetrieval}
          requiredFields={requiredFields}
        />
      </Grid>
    </Grid>
  );
}

export default DataProtectionProfileDetail;
