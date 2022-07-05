import { ProfileMain } from "../../../common/components/profile/profile-main";
import {
  Box,
  CircularProgress,
  Container,
  Typography,
} from "@material-ui/core";
import { useRouter } from "next/router";
import { useDataProtectionInformation } from "../../../common/hooks/useMockApi";
import { DataProtectionInformation } from "../../../common/util/apiDataRetrieval";
import ErrorComponent from "../../../common/components/error-component";

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
    <Typography variant="subtitle2">
      <Box display="flex" justifyContent="flex-end" alignItems="center">
        Data protection length: {data.dataProtectionYears} years
      </Box>
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
    return <ErrorComponent />;
  }

  return (
    <Container>
      <GetDataRetentionPeriod
        data={dataDetailsRetrieval.data}
        isLoading={dataDetailsRetrieval.isLoading}
        isError={dataDetailsRetrieval.isError}
      />
      <ProfileMain
        rdfFields={dataDetailsRetrieval.data.dataProtectionFields}
        webId={guestWebId}
        editable={false}
        deletable={false}
        centerJustify={true}
      />
    </Container>
  );
}

export default DataProtectionProfileDetail;
