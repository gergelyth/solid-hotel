import { Grid, Typography, Button, Box } from "@material-ui/core";
import QRCode from "react-qr-code";
import { GPAPairUrl } from "../../../common/consts/locations";
import { Dispatch, SetStateAction } from "react";
import { OfflineCheckinPage } from "../../pages/checkin";
import { CreateInboxUrlFromReservationId } from "../../../common/util/urlParser";

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

  //TODO this way, since this is public, everybody could get the PI of the guest, since everybody could send a pairing request here
  //would need a token in the reservation component which is sent in the pairing URL and only accept pairing requests which match this
  const hotelInboxUrl = CreateInboxUrlFromReservationId(reservationId);

  //TODO more robust logic here
  const targetUrl = `${GPAPairUrl}?hotelInboxUrl=${encodeURIComponent(
    hotelInboxUrl
  )}`;

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
        <QRCode value={targetUrl} size={512} />
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
