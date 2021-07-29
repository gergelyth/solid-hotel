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
        <QRCode value={targetUrl} size={512} />;
      </Grid>
    </Grid>
  );
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
