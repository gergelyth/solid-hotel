import { useRouter } from "next/router";
import { Button, Container, Typography } from "@material-ui/core";

function SuccessPage(): JSX.Element {
  const router = useRouter();

  return (
    <Container maxWidth="sm">
      <h2>
        <Typography>Reservation successful!</Typography>
      </h2>
      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push("/")}
      >
        Return to index page
      </Button>
    </Container>
  );
}

export default SuccessPage;
