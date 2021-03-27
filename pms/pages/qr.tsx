import Head from "next/head";
import { Grid, Typography, Button, Box } from "@material-ui/core";
import { useRouter } from "next/router";
import QRCode from "react-qr-code";
import { GPAPairUrl } from "../../common/consts/locations";

function QRPage(): JSX.Element {
  const router = useRouter();
  //TODO get this with router from the query params
  const createdUserId = 11;

  //TODO more robust logic here
  const targetUrl = `${GPAPairUrl}?userId=${createdUserId}`;
  return (
    <Grid
      container
      spacing={7}
      justify="center"
      alignItems="center"
      direction="column"
    >
      <Grid item>
        <Head>
          <title>Pairing request</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
      </Grid>
      <Grid item>
        <h1>Pairing request</h1>
      </Grid>
      <Grid item>
        <Typography>
          Please scan this barcode on the guest&apos;s device to install the
          Guest Portal Application and pair this profile.
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
            className={"button"}
            onClick={() => {
              router.push("/guests");
            }}
          >
            Continue
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
}

export default QRPage;
