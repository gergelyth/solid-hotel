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
import { ErrorComponent } from "../../../common/components/error-component";
import { AppProps } from "next/app";
import { GetServerSidePropsResult } from "next";

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
    <Box display="flex" justifyContent="flex-end" alignItems="center">
      <Typography variant="subtitle2">
        Data protection length: {data.dataProtectionStorageDuration.years}{" "}
        years, {data.dataProtectionStorageDuration.months} months,{" "}
        {data.dataProtectionStorageDuration.days}
      </Typography>
    </Box>
  );
}

/**
 * Parses the data protection profile WebId from the query parameters.
 * @returns The data protection profile WebId as a prop or the notFound flag if the id is missing (which redirects to /404 then).
 */
export function getServerSideProps(
  appProps: AppProps
): GetServerSidePropsResult<{
  guestWebId: string;
}> {
  const query = appProps.router.query;
  if (!query.id) {
    return {
      notFound: true,
    };
  }

  const guestWebId = Array.isArray(query.id) ? query.id[0] : query.id;

  return {
    props: { guestWebId },
  };
}

/**
 * The page displayed for the guest data protection profile in PMS.
 * The data protection profile URL is passed as a query parameter.
 * Contains a read-only version of the profile editor component by {@link ProfileMain} where the fields are neither editable nor deletable.
 * In addition it contains a small text component which displays the data protection retention period in effect for the guest.
 * @returns The data protection profile page for a specific guest.
 */
function DataProtectionProfileDetail(
  appProps: AppProps<{
    guestWebId: string;
  }>
): JSX.Element | null {
  const guestWebId: string = appProps.pageProps.guestWebId;

  const dataDetailsRetrieval = useDataProtectionInformation(
    undefined,
    guestWebId
  );

  const router = useRouter();
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
