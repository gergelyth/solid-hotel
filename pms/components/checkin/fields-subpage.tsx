import { useRequiredFields } from "../../../common/hooks/useMockApi";
import { Box, CircularProgress, Grid, Typography } from "@material-ui/core";
import { Dispatch, SetStateAction } from "react";
import { OfflineCheckinPage } from "../../pages/checkin";
import { useRouter } from "next/router";
import { RequiredFields } from "./required-fields";
import { ErrorComponent } from "../../../common/components/error-component";

/**
 * Has the responsibility to collect the values for all RDF fields required for check-in.
 * The required fields are retrieved from the mock API utility and are based on the guest's nationality and the hotel's country.
 * The reservation ID, nationality of the guest and hotel profile WebId are passed as query parameters.
 * The proceed button is disabled until every field has a value.
 * When the button is enabled and clicked, we execute the check-in operation.
 * @returns A component containing the profile fields and the ability to edit their values and a proceed button which triggers the check-in.
 */
export function RequiredFieldsAtOfflineCheckin({
  currentPage,
  setCurrentPage,
  executeCheckin,
}: {
  currentPage: OfflineCheckinPage;
  setCurrentPage: Dispatch<SetStateAction<OfflineCheckinPage>>;
  executeCheckin: (hotelProfileWebId: string) => void;
}): JSX.Element | null {
  const router = useRouter();

  //TODO reservation ID is unnecessary?
  let reservationId = router.query.id;
  if (Array.isArray(reservationId)) {
    reservationId = reservationId[0];
  }
  let nationality = router.query.nationality;
  if (Array.isArray(nationality)) {
    nationality = nationality[0];
  }
  const { data, isLoading, isError } = useRequiredFields(nationality);

  const hotelProfileParam = router.query.hotelProfile;

  if (!reservationId || !nationality || !hotelProfileParam) {
    router.push("/404");
    return null;
  }

  const hotelProfileWebId = Array.isArray(hotelProfileParam)
    ? hotelProfileParam[0]
    : hotelProfileParam;

  if (currentPage !== OfflineCheckinPage.RequiredFields) {
    return null;
  }

  if (isLoading) {
    return <CircularProgress />;
  }
  if (isError || !data) {
    return <ErrorComponent />;
  }

  return (
    <Grid
      container
      spacing={2}
      justifyContent="center"
      alignItems="stretch"
      direction="column"
    >
      <Grid item container justifyContent="center">
        <Typography variant="h4">Check-in</Typography>
      </Grid>
      <Grid item container justifyContent="center">
        <Box fontWeight="fontWeightBold">
          <Typography>Required personal information</Typography>
        </Box>
      </Grid>
      <RequiredFields
        data={data}
        hotelProfileWebId={hotelProfileWebId}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        executeCheckin={executeCheckin}
      />
    </Grid>
  );
}
