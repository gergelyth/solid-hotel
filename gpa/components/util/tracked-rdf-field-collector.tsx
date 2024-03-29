import { CloseSnackbar } from "../../../common/components/snackbar";
import { GetUserPrivacyPodUrl } from "../../../common/util/solid";
import { CustomProgressSnackbar } from "../../../common/components/custom-progress-snackbar";
import { Dispatch, forwardRef, SetStateAction, useEffect } from "react";
import { GuestPrivacyToken } from "../../../common/types/GuestPrivacyToken";
import { useReservations } from "../../../common/hooks/useReservations";
import { GetUserReservationsPodUrl } from "../../../common/util/solidReservations";
import { ReservationState } from "../../../common/types/ReservationState";
import { useGuestPrivacyTokens } from "../../../common/hooks/usePrivacyTokens";
import { ShowError } from "../../../common/util/helpers";

/** A helper type describing a mapping from hotel WebId to the set of RDF fields. */
export type HotelToRdf = {
  [hotel: string]: Set<string>;
};

/**
 * The function that determines the currently tracked fields.
 * We filter the privacy tokens so they only reference active reservation and which are not past their expiry.
 * @returns A hotel WebId to RDF fields map.
 */
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

/**
 * A snackbar notification displayed in the bottom right corner determining which hotel tracks which personal information fields currently.
 * We define the list of active reservations first, deduce the hotel WebIds from those and pair the privacy tokens to these hotels.
 * Note that we can't use the mockAPI to get the required RDF fields, because the nationality may change between the current moment and the moment the hotel profile was submitted and saved on the hotel's side.
 * @returns A custom progress snackbar collecting the currently tracked fields.
 */
export const TrackedRdfFieldCollector = forwardRef<
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
    if (privacyTokensError || reservationsError) {
      CloseSnackbar(props.snackbarId);
      ShowError(
        `Error using the privacy tokens hook [${privacyTokensError}] or the reservations hook [${reservationsError}] during RDF field collection`,
        false
      );
      return;
    }

    if (!privacyTokens || !reservations) {
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
      snackbarKey={props.snackbarId}
      message={"Collecting tracked RDF fields"}
    />
  );
});

TrackedRdfFieldCollector.displayName = "TrackedRdfFieldCollector";
