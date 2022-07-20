import { ProfileMain } from "../../../common/components/profile/profile-main";
import { Button, Grid, Divider } from "@material-ui/core";
import { useRouter } from "next/router";
import { useRequiredFields } from "../../../common/hooks/useMockApi";
import { RegistrationCard } from "../../components/profile/registration-card";
import { useState } from "react";
import { ForeignPoliceReport } from "../../components/profile/foreign-police-report";
import { AppProps } from "next/app";
import { GetServerSidePropsResult } from "next";

/**
 * Parses the active profile WebId from the query parameters.
 * @returns The active profile WebId as a prop or the notFound flag if the id is missing (which redirects to /404 then).
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
 * The page displayed for the guest active profile in PMS.
 * The hotel profile URL is passed as a query parameter.
 * Contains a profile editor component by {@link ProfileMain} where the fields are editable but not deletable.
 * In addition it contains the option to print out the registration card and export the CSV file for the authorities report.
 * @returns The hotel profile page for a specific guest.
 */
function ActiveHotelProfileDetail(
  appProps: AppProps<{
    guestWebId: string;
  }>
): JSX.Element | null {
  const [isRegPopupShowing, setRegPopupVisibility] = useState(false);

  const guestWebId: string = appProps.pageProps.guestWebId;
  const requiredFields = useRequiredFields(undefined, guestWebId);

  const router = useRouter();
  if (!guestWebId) {
    router.push("/404");
    return null;
  }

  return (
    <Grid
      container
      spacing={3}
      justifyContent="center"
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
        justifyContent="center"
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
          <ForeignPoliceReport
            rdfFields={requiredFields.data}
            webId={guestWebId}
          />
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
