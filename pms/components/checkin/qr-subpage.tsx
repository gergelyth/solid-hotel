import {
  Grid,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@material-ui/core";
import QRCode from "react-qr-code";
import { GPAPairUrl } from "../../../common/consts/locations";
import { Dispatch, SetStateAction } from "react";
import { OfflineCheckinPage } from "../../pages/checkin";
import {
  CreateInboxUrlFromReservationId,
  GetCoreReservationFolderFromInboxUrl,
} from "../../../common/util/urlParser";
import { GetPairingToken } from "../../util/pairingTokenHandler";
import { ShowErrorSnackbar } from "../../../common/components/snackbar";

function QrCodeElement({
  hotelInboxUrl,
  reservationFolder,
}: {
  hotelInboxUrl: string;
  reservationFolder: string;
}): JSX.Element {
  const pairingTokenPromise = GetPairingToken(reservationFolder);
  pairingTokenPromise.then((token) => {
    if (!token) {
      ShowErrorSnackbar(
        `Pairing token doesn't exist for reservation [${reservationFolder}]`
      );
      return null;
    }

    const targetUrl = new URL(GPAPairUrl);
    targetUrl.search = new URLSearchParams({
      hotelInboxUrl: encodeURIComponent(hotelInboxUrl),
      token: encodeURIComponent(token),
    }).toString();

    return <QRCode value={targetUrl.toString()} size={512} />;
  });

  return <CircularProgress />;
}

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

  const hotelInboxUrl = CreateInboxUrlFromReservationId(reservationId);
  const reservationFolder = GetCoreReservationFolderFromInboxUrl(hotelInboxUrl);

  return (
    <Grid
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
        <Typography>
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
