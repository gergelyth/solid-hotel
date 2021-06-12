import ProfileMain from "../../../common/components/profile/profile-main";
import { useRequiredFields } from "../../../common/hooks/useMockApi";
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@material-ui/core";
import { Dispatch, SetStateAction } from "react";
import ConfirmRequiredFieldsButton from "../../../common/components/profile/required-fields-button";
import { OfflineCheckinPage } from "../../pages/checkin";
import { useRouter } from "next/router";
import { CreateHotelProfile } from "../../util/hotelProfileHandler";
import GetSupportedFields from "../../../common/consts/supported-fields";
import { HotelProfilesUrl } from "../../../common/consts/solidIdentifiers";

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

  let reservationId = router.query.reservationId;
  if (Array.isArray(reservationId)) {
    reservationId = reservationId[0];
  }
  let nationality = router.query.nationality;
  if (Array.isArray(nationality)) {
    nationality = nationality[0];
  }

  const { data, isLoading, isError } = useRequiredFields(nationality);

  if (currentPage !== OfflineCheckinPage.RequiredFields) {
    return null;
  }

  if (isLoading) {
    return <CircularProgress />;
  }
  if (isError || !data) {
    return (
      <Container maxWidth="sm">
        <Typography>An error occurred.</Typography>
        <Typography>{isError}</Typography>
      </Container>
    );
  }

  const nationalityField = GetSupportedFields().find(
    (x) => x.fieldShortName == "nationality"
  );
  if (!nationalityField) {
    throw new Error("Nationality field not in supported fields list");
  }
  nationalityField.fieldValue = nationality;

  const hotelProfileWebId = CreateHotelProfile(
    [nationalityField],
    HotelProfilesUrl
  );

  //TODO search internet how to write condition while Promise is not resolved return CircularProgress

  return (
    <Grid
      container
      spacing={3}
      justify="center"
      alignItems="center"
      direction="column"
    >
      <Grid item>
        <Typography variant="h4">Check-in</Typography>
      </Grid>
      <Grid item>
        <Typography>
          <Box fontWeight="fontWeightBold">Required personal information</Box>
        </Typography>
      </Grid>
      <Grid item>
        <ProfileMain rdfFields={data} webId={hotelProfileWebId} />
      </Grid>
      <Grid item>
        <ConfirmRequiredFieldsButton
          onClickFunction={() => {
            executeCheckin(hotelProfileWebId);
            setCurrentPage(currentPage + 1);
          }}
          rdfFields={data}
        />
      </Grid>
    </Grid>
  );
}

export default RequiredFieldsAtOfflineCheckin;
