import { Box, CircularProgress, Typography } from "@material-ui/core";
import { GetServerSidePropsResult } from "next";
import { useRouter } from "next/router";
import React from "react";
import { useEffect, useState } from "react";
import { ShowErrorSnackbar } from "../../common/components/snackbar";
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
    hotel: "https://dummyhotel.com",
    room: "https://dummyroom.com",
    state: ReservationState.REQUESTED,
    dateFrom: new Date(),
    dateTo: new Date(),
  };
}

/**
 * Parses the pairing token and the hotel inbox URL from the query parameters.
 * @returns The two fields as props or the notFound flag if either of them is missing (which redirects to /404 then).
 */
export function getServerSideProps(): GetServerSidePropsResult<unknown> {
  return {
    props: {},
  };
}

/**
 * The page displayed for the GPA pairing operation, which prompts the user to log-in first if not already (optionally create a Solid Pod).
 * Parses the pairing token and the hotel inbox URL from the query parameters.
 * Creates a dummy placeholder reservation with the inbox (so the hotel can reply) and submits the pairing request to the hotel.
 * @returns The pairing operation page.
 */
function PairingPage(): JSX.Element | null {
  const router = useRouter();
  const [isLoading, setLoading] = useState(true);
  const isLoggedIn = GetSession().info.isLoggedIn;

  useEffect(() => {
    let hotelInboxUrl = Array.isArray(router.query.hotelInboxUrl)
      ? router.query.hotelInboxUrl[0]
      : router.query.hotelInboxUrl;

    const pairingToken = Array.isArray(router.query.token)
      ? router.query.token[0]
      : router.query.token;

    if (!pairingToken || !hotelInboxUrl) {
      router.push("/404");
      return;
    }

    if (!isLoggedIn) {
      ShowErrorSnackbar("Please log in to pair your reservation");
      return;
    }

    const guestInboxUrl = AddReservation(CreateDummyReservation(), HotelWebId);
    // RevalidateReservations();
    hotelInboxUrl = decodeURIComponent(hotelInboxUrl);
    SubmitInitialPairingRequest(guestInboxUrl, pairingToken, hotelInboxUrl);
    setLoading(false);
  }, [isLoggedIn]);

  return (
    <Box textAlign={"center"}>
      {isLoading ? null : (
        <React.Fragment>
          <Typography variant="h4">Pairing request sent</Typography>
          <Typography variant="h6">
            Waiting for the hotel&apos;s response...
          </Typography>
        </React.Fragment>
      )}
      <Typography variant="h6">
        <CircularProgress />
      </Typography>
    </Box>
  );
}

export default PairingPage;
