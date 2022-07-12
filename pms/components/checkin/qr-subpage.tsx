import {
  Grid,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@material-ui/core";
import QRCode from "react-qr-code";
import { GPAPairUrl } from "../../../common/consts/locations";
import { Dispatch, SetStateAction, useState } from "react";
import { OfflineCheckinPage } from "../../pages/checkin";
import {
  CreateInboxUrlFromReservationId,
  GetCoreReservationFolderFromInboxUrl,
} from "../../../common/util/urlParser";
import { GetPairingToken } from "../../../common/util/pairingTokenHandler";
import { ShowErrorSnackbar } from "../../../common/components/snackbar";
import Link from "next/link";

/**
 * Fetches the pairing token of the reservation and creates the QR target URL.
 * It's the pairing/ page in the GPA coupled with the query parameters of the hotel inbox URL and the pairing token.
 * The target URL is propagated upward through a set state action.
 */
async function SetTargetUrl(
  hotelInboxUrl: string,
  reservationFolder: string,
  setTargetUrl: Dispatch<SetStateAction<string | undefined>>
): Promise<void> {
  const pairingToken = await GetPairingToken(reservationFolder);

  if (!pairingToken) {
    ShowErrorSnackbar(
      `Pairing token doesn't exist for reservation [${reservationFolder}]`
    );
    return;
  }

  const targetUrl = new URL(GPAPairUrl);
  targetUrl.search = new URLSearchParams({
    hotelInboxUrl: encodeURIComponent(hotelInboxUrl),
    token: encodeURIComponent(pairingToken),
  }).toString();

  setTargetUrl(targetUrl.toString());
}

/**
 * The QR code embodies the target URL which is the pairing page in the GPA coupled with the query parameters of the hotel inbox URL (in which the guest can reply back) and the pairing token.
 * The URL itself is displayed for ease of access.
 * @returns The QR code and the URL link with the same target URL.
 */
function QrCodeElement({
  hotelInboxUrl,
  reservationFolder,
}: {
  hotelInboxUrl: string;
  reservationFolder: string;
}): JSX.Element {
  const [targetUrl, setTargetUrl] = useState<string>();

  if (!targetUrl) {
    SetTargetUrl(hotelInboxUrl, reservationFolder, setTargetUrl);
    return <CircularProgress />;
  }

  return (
    <Grid
      container
      spacing={4}
      justify="center"
      alignItems="center"
      direction="column"
    >
      <Grid item>
        <Typography align="center">
          <Link href={targetUrl}>{targetUrl}</Link>
        </Typography>
      </Grid>
      <Grid item>
        <QRCode value={targetUrl} />;
      </Grid>
    </Grid>
  );
}

/**
 * Presents a QR code (as well as an URL link) directing the user to the GPA page which will guide them creating a Solid Pod and pairing that to the current reservation.
 * @returns A component containing the QR code, an URL link and the instruction for the user.
 */
export function QrElementWithHeadings({
  reservationId,
}: {
  reservationId: string;
}): JSX.Element {
  const hotelInboxUrl = CreateInboxUrlFromReservationId(reservationId);
  const reservationFolder = GetCoreReservationFolderFromInboxUrl(hotelInboxUrl);

  return (
    <Grid
      item
      container
      spacing={7}
      justify="center"
      alignItems="center"
      direction="column"
    >
      <Grid item>
        <Typography variant="h4">Pairing request</Typography>
      </Grid>
      <Grid item>
        <Typography align="center">
          Please scan this barcode on the guest&apos;s device to open the Guest
          Portal Application and pair this profile.
        </Typography>
      </Grid>
      <Grid item>
        <QrCodeElement
          hotelInboxUrl={hotelInboxUrl}
          reservationFolder={reservationFolder}
        />
      </Grid>
    </Grid>
  );
}

/**
 * Presents a QR code (as well as an URL link) directing the user to the GPA page which will guide them creating a Solid Pod and pairing that to the current reservation.
 * @returns A component containing the QR code, an URL link and acknowledging Continue button to proceed with the operation.
 */
function QrComponent({
  reservationId,
  currentPage,
  setCurrentPage,
}: {
  reservationId: string;
  currentPage: OfflineCheckinPage;
  setCurrentPage: Dispatch<SetStateAction<OfflineCheckinPage>>;
}): JSX.Element | null {
  if (currentPage !== OfflineCheckinPage.QrComponent) {
    return null;
  }

  return (
    <Grid
      container
      spacing={7}
      justify="center"
      alignItems="center"
      direction="column"
    >
      <QrElementWithHeadings reservationId={reservationId} />
      <Grid item>
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setCurrentPage(currentPage + 1);
            }}
          >
            Continue
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}

export default QrComponent;
