import { Box, CircularProgress, Typography } from "@material-ui/core";
import { useRouter } from "next/router";
import { ReservationAtHotel } from "../../common/types/ReservationAtHotel";
import { ReservationState } from "../../common/types/ReservationState";
import { GetSession } from "../../common/util/solid";
import { AddReservation } from "../../common/util/solid_reservations";
import { SubmitInitialPairingRequest } from "../util/outgoingCommunications";

function GetQueryParameter(parameter: string | string[] | undefined): string {
  if (!parameter) {
    //TODO something like nameof here
    throw new Error(`Query parameter ${parameter} doesnt exist`);
  }

  return Array.isArray(parameter) ? parameter[0] : parameter;
}

function CreateDummyReservation(): ReservationAtHotel {
  return {
    id: `reservationDummy`,
    inbox: null,
    owner: "",
    hotel: "",
    room: "",
    state: ReservationState.REQUESTED,
    dateFrom: new Date(),
    dateTo: new Date(),
  };
}

function PairingPage(): JSX.Element {
  const router = useRouter();

  const hotelInboxUrl = decodeURIComponent(
    GetQueryParameter(router.query.hotelInboxUrl)
  );
  const pairingToken = decodeURIComponent(
    GetQueryParameter(router.query.token)
  );

  const session = GetSession();
  if (!session.info.isLoggedIn) {
    //TODO this wont take us back here
    //we need logic to come back to this url
    router.push("/login");
  }

  const guestInboxUrl = AddReservation(CreateDummyReservation());
  SubmitInitialPairingRequest(
    guestInboxUrl,
    pairingToken,
    hotelInboxUrl,
    session
  );

  //TODO wait for specific incoming request - potentially implement this in VerifyingPage as well

  return (
    <Box>
      <Typography variant="h4">Pairing request sent</Typography>
      <Typography variant="h6">
        Waiting for the hotel&apos;s response...
      </Typography>
      <CircularProgress />
    </Box>
  );
}

export default PairingPage;
