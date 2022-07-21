import { Box, CircularProgress, Typography } from "@material-ui/core";
import { GetServerSidePropsResult } from "next";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { HotelWebId } from "../../common/consts/solidIdentifiers";
import { RevalidateReservations } from "../../common/hooks/useReservations";
import { ReservationAtHotel } from "../../common/types/ReservationAtHotel";
import { ReservationState } from "../../common/types/ReservationState";
import { GetSession } from "../../common/util/solid";
import { AddReservation } from "../../common/util/solidReservations";
import { SubmitInitialPairingRequest } from "../util/outgoingCommunications";

/**
 * Creates a placeholder reservation which will then be populated after the hotel sends over the information.
 * @returns A dummy reservation.
 */
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

/**
 * Parses the pairing token and the hotel inbox URL from the query parameters.
 * @returns The two fields as props or the notFound flag if either of them is missing (which redirects to /404 then).
 */
export function getServerSideProps(
  appProps: AppProps
): GetServerSidePropsResult<{
  hotelInboxUrl: string;
  token: string;
}> {
  const query = appProps.router.query;
  if (!query.hotelInboxUrl || !query.token) {
    return {
      notFound: true,
    };
  }

  const hotelInboxUrl = Array.isArray(query.hotelInboxUrl)
    ? query.hotelInboxUrl[0]
    : query.hotelInboxUrl;
  const token = Array.isArray(query.token) ? query.token[0] : query.token;

  return {
    props: { hotelInboxUrl, token },
  };
}

/**
 * The page displayed for the GPA pairing operation, which prompts the user to log-in first if not already (optionally create a Solid Pod).
 * Parses the pairing token and the hotel inbox URL from the query parameters.
 * Creates a dummy placeholder reservation with the inbox (so the hotel can reply) and submits the pairing request to the hotel.
 * @returns The pairing operation page.
 */
function PairingPage(
  appProps: AppProps<{
    hotelInboxUrl: string;
    token: string;
  }>
): JSX.Element | null {
  const router = useRouter();

  const hotelInboxUrl: string = appProps.pageProps.hotelInboxUrl;
  const pairingToken: string = appProps.pageProps.token;

  const session = GetSession();
  if (!session.info.isLoggedIn) {
    //TODO this wont take us back here
    //we need logic to come back to this url
    router.push("/login");
  }

  const guestInboxUrl = AddReservation(CreateDummyReservation(), HotelWebId);
  RevalidateReservations();
  SubmitInitialPairingRequest(guestInboxUrl, pairingToken, hotelInboxUrl);

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
