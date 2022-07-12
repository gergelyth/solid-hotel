import { ProfileMain } from "../../../common/components/profile/profile-main";
import { Button, Grid, Divider } from "@material-ui/core";
import { useRouter } from "next/router";
import { useRequiredFields } from "../../../common/hooks/useMockApi";
import { RegistrationCard } from "../../components/profile/registration-card";
import { useState } from "react";
import { ForeignPoliceReport } from "../../components/profile/foreign-police-report";

/**
 * The page displayed for the guest active profile in PMS.
 * The hotel profile URL is passed as a query parameter.
 * Contains a profile editor component by {@link ProfileMain} where the fields are editable but not deletable.
 * In addition it contains the option to print out the registration card and export the CSV file for the authorities report.
 * @returns The hotel profile page for a specific guest.
 */
function ActiveHotelProfileDetail(): JSX.Element | null {
  const [isRegPopupShowing, setRegPopupVisibility] = useState(false);
  const router = useRouter();

  let guestWebId = router.query.id;
  if (Array.isArray(guestWebId)) {
    guestWebId = guestWebId[0];
  }

  const requiredFields = useRequiredFields(undefined, guestWebId);

  if (!guestWebId) {
    router.push("/404");
    return null;
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
