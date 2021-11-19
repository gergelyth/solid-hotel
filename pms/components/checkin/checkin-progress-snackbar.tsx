import { Grid, Typography, Box, LinearProgress, Card } from "@material-ui/core";
import { SnackbarContent } from "notistack";
import { makeStyles } from "@material-ui/core/styles";
import { forwardRef } from "react";
import {
  GetWebIdFromReservation,
  SetReservationOwnerToHotelProfile,
} from "../../../common/util/solid_reservations";
import { useRequiredFields } from "../../../common/hooks/useMockApi";
import { useGuest } from "../../../common/hooks/useGuest";
import { CreateHotelProfile } from "../../../common/util/hotelProfileHandler";
import { HotelProfilesUrl } from "../../../common/consts/solidIdentifiers";
import { getDatetime } from "@inrupt/solid-client";
import { reservationFieldToRdfMap } from "../../../common/vocabularies/rdf_reservation";
import { CreateActiveProfilePrivacyToken } from "../../util/privacyHelper";
import { SendPrivacyToken } from "../../util/outgoingCommunications";
import { CloseSnackbar } from "../../../common/components/snackbar";

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up("sm")]: {
      minWidth: "344px !important",
    },
  },
  card: {
    width: "100%",
  },
}));

async function ExecuteCheckIn(
  reservationId: string,
  replyInbox: string
): Promise<void> {
  const guestWebId = await GetWebIdFromReservation(reservationId);
  if (!guestWebId) {
    //TODO solve for offline checkin
    throw new Error(`Guest webID null in reservation ${reservationId}`);
  }

  const requiredFields = useRequiredFields(undefined, guestWebId);
  const { guestFields, isLoading, isError } = useGuest(
    requiredFields?.data,
    guestWebId
  );

  //TODO this is dirty, possibly a better solution?
  while (isLoading || !requiredFields.data) {
    await new Promise((r) => setTimeout(r, 500));
  }

  if (!guestFields || isError) {
    throw new Error("Failed to retrieve required elements from guest Pod");
  }

  const hotelProfileWebId = await CreateHotelProfile(
    guestFields,
    HotelProfilesUrl
  );
  //TODO are we allowed to do this? we probably won't need the guest WebId anymore
  const reservationThing = await SetReservationOwnerToHotelProfile(
    reservationId,
    hotelProfileWebId
  );

  const checkoutDate = getDatetime(
    reservationThing,
    reservationFieldToRdfMap.checkoutTime
  );
  if (!checkoutDate) {
    throw new Error("Checkout date is null in reservation");
  }

  const privacyToken = await CreateActiveProfilePrivacyToken(
    hotelProfileWebId,
    guestWebId,
    requiredFields.data,
    checkoutDate
  );

  SendPrivacyToken(replyInbox, privacyToken);
  console.log("privacy token sent");
}

const CheckinProgressSnackbar = forwardRef<
  HTMLDivElement,
  { key: string | number; reservationId: string; replyInbox: string }
>((props, ref) => {
  const classes = useStyles();

  ExecuteCheckIn(props.reservationId, props.replyInbox).then(() =>
    CloseSnackbar(props.key)
  );

  return (
    <SnackbarContent ref={ref} className={classes.root} key={props.key}>
      <Card className={classes.card} raised>
        <Box m={2} p={2}>
          <Grid container spacing={2} justify="center" direction="column">
            <Grid item>
              <Typography variant="h6">
                <Box fontWeight="fontWeightBold" textAlign="center">
                  Checking in guest
                </Box>
              </Typography>
            </Grid>
            <Grid item>
              <LinearProgress />
            </Grid>
          </Grid>
        </Box>
      </Card>
    </SnackbarContent>
  );
});

CheckinProgressSnackbar.displayName = "CheckinProgressSnackbar";

export default CheckinProgressSnackbar;
