import { Grid, Typography, Box, LinearProgress, Card } from "@material-ui/core";
import { SnackbarContent } from "notistack";
import { makeStyles } from "@material-ui/core/styles";
import { forwardRef, useEffect } from "react";
import { SetReservationOwnerToHotelProfile } from "../../../common/util/solid_reservations";
import { useRequiredFields } from "../../../common/hooks/useMockApi";
import { useGuest } from "../../../common/hooks/useGuest";
import { CreateHotelProfile } from "../../../common/util/hotelProfileHandler";
import { HotelProfilesUrl } from "../../../common/consts/solidIdentifiers";
import { getDatetime } from "@inrupt/solid-client";
import { reservationFieldToRdfMap } from "../../../common/vocabularies/rdf_reservation";
import { CreateActiveProfilePrivacyToken } from "../../util/privacyHelper";
import { SendPrivacyToken } from "../../util/outgoingCommunications";
import { CloseSnackbar } from "../../../common/components/snackbar";
import { Field } from "../../../common/types/Field";

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
  guestWebId: string,
  guestFields: Field[],
  requiredFields: string[],
  replyInbox: string
): Promise<void> {
  console.log("execute check-in started");
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
    requiredFields,
    checkoutDate
  );

  SendPrivacyToken(replyInbox, privacyToken);
  console.log("privacy token sent");
}

const CheckinProgressSnackbar = forwardRef<
  HTMLDivElement,
  {
    key: string | number;
    reservationId: string;
    guestWebId: string;
    replyInbox: string;
  }
>((props, ref) => {
  const requiredFields = useRequiredFields(undefined, props.guestWebId);
  const { guestFields, isError } = useGuest(
    requiredFields?.data,
    props.guestWebId
  );

  useEffect(() => {
    console.log("effect started");
    if (isError) {
      CloseSnackbar(props.key);
      throw new Error(
        "Error using the hooks during check-in (potentially failed to retrieve fields from user's Pod)."
      );
    }

    if (!guestFields) {
      console.log("guest fields null");
      return;
    }

    if (!requiredFields?.data) {
      throw new Error(
        "Required fields is undefined during check-in even though guest fields is not. This shouldn't happen."
      );
    }

    ExecuteCheckIn(
      props.reservationId,
      props.guestWebId,
      guestFields,
      requiredFields.data,
      props.replyInbox
    ).then(() => CloseSnackbar(props.key));
  }, [guestFields, isError]);

  const classes = useStyles();
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
