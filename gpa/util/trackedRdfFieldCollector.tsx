import { CloseSnackbar } from "../../common/components/snackbar";
import { GetUserPrivacyPodUrl } from "../../common/util/solid";
import CustomProgressSnackbar from "../../common/components/custom-progress-snackbar";
import { Dispatch, forwardRef, SetStateAction, useEffect } from "react";
import { GuestPrivacyToken } from "../../common/types/GuestPrivacyToken";
import { useReservations } from "../../common/hooks/useReservations";
import { GetUserReservationsPodUrl } from "../../common/util/solid_reservations";
import { ReservationState } from "../../common/types/ReservationState";
import { useGuestPrivacyTokens } from "../../common/hooks/usePrivacyTokens";

//we cant use the mockAPI to get the required RDF fields, because what if the nationality
//changed between the current moment and the moment the hotel profile was submitted and saved on the hotel side

export type HotelToRdf = {
  [hotel: string]: Set<string>;
};

function CollectRdfFields(
  hotelsWithActiveReservation: string[],
  privacyTokens: (GuestPrivacyToken | null)[]
): HotelToRdf {
  const hotelToRdfFieldMap: { [hotel: string]: Set<string> } =
    hotelsWithActiveReservation.reduce(
      (dict, hotel) => ({ ...dict, [hotel]: new Set<string>() }),
      {}
    );
  const currentDate = new Date();
  privacyTokens
    .filter(
      (token) =>
        token &&
        token.forReservationState === ReservationState.ACTIVE &&
        token.expiry >= currentDate &&
        hotelToRdfFieldMap[token.hotel] !== undefined
    )
    .forEach((token) => {
      if (!token) {
        return;
      }
      token.fieldList.forEach((field) =>
        hotelToRdfFieldMap[token.hotel].add(field)
      );
    });

  return hotelToRdfFieldMap;
}

const TrackedRdfFieldCollector = forwardRef<
  HTMLDivElement,
  {
    snackbarId: string | number;
    setHotelToRdfMap: Dispatch<SetStateAction<HotelToRdf | undefined>>;
  }
>((props, ref) => {
  const { items: privacyTokens, isError: privacyTokensError } =
    useGuestPrivacyTokens(GetUserPrivacyPodUrl());
  const { items: reservations, isError: reservationsError } = useReservations(
    GetUserReservationsPodUrl()
  );

  useEffect(() => {
    console.log("tracked RDF field collector effect started");
    if (privacyTokensError || reservationsError) {
      CloseSnackbar(props.snackbarId);
      throw new Error(
        `Error using the privacy tokens hook [${privacyTokensError}] or the reservations hook [${reservationsError}] during RDF field collection`
      );
    }

    if (!privacyTokens || !reservations) {
      console.log("reservations or privacy tokens null");
      return;
    }

    const hotelsWithActiveReservation = reservations.flatMap((reservation) => {
      if (reservation && reservation.state === ReservationState.ACTIVE) {
        return reservation.hotel;
      }
      return [];
    });
    const hotelToRdfFieldMap = CollectRdfFields(
      hotelsWithActiveReservation,
      privacyTokens
    );

    props.setHotelToRdfMap(hotelToRdfFieldMap);
    CloseSnackbar(props.snackbarId);
  }, [privacyTokens, reservations, privacyTokensError, reservationsError]);

  return (
    <CustomProgressSnackbar
      ref={ref}
      key={props.snackbarId}
      message={"Collecting tracked RDF fields"}
    />
  );
});

TrackedRdfFieldCollector.displayName = "TrackedRdfFieldCollector";

export default TrackedRdfFieldCollector;
