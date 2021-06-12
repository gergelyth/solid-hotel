import { Grid, Typography, Button, Box } from "@material-ui/core";
import QRCode from "react-qr-code";
import { GPAPairUrl } from "../../../common/consts/locations";
import { Dispatch, SetStateAction } from "react";
import { OfflineCheckinPage } from "../../pages/checkin";

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

  //TODO more robust logic here
  const targetUrl = `${GPAPairUrl}?reservationId=${reservationId}`;

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
