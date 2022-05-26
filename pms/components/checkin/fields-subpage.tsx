import { useRequiredFields } from "../../../common/hooks/useMockApi";
import { Box, CircularProgress, Grid, Typography } from "@material-ui/core";
import { Dispatch, SetStateAction } from "react";
import { OfflineCheckinPage } from "../../pages/checkin";
import { useRouter } from "next/router";
import { RequiredFields } from "./required-fields";
import ErrorComponent from "../../../common/components/error-component";

function RequiredFieldsAtOfflineCheckin({
  currentPage,
  setCurrentPage,
  executeCheckin,
}: {
  currentPage: OfflineCheckinPage;
  setCurrentPage: Dispatch<SetStateAction<OfflineCheckinPage>>;
  executeCheckin: (hotelProfileWebId: string) => void;
}): JSX.Element | null {
  const router = useRouter();

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
      justify="center"
      alignItems="stretch"
      direction="column"
    >
      <Grid item container justify="center">
        <Typography variant="h4">Check-in</Typography>
      </Grid>
      <Grid item container justify="center">
        <Typography>
          <Box fontWeight="fontWeightBold">Required personal information</Box>
        </Typography>
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

export default RequiredFieldsAtOfflineCheckin;
