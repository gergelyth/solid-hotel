// TODO: Temporary solution - should unify all success pages

import { NextRouter, useRouter } from "next/router";
import { Button, Container, Typography } from "@material-ui/core";

function ReturnToReservations(router: NextRouter): void {
  router.push("/reservations");
}

function CheckoutSuccessPage(): JSX.Element {
  const router = useRouter();

  return (
    <Container maxWidth="sm">
      <h2>
        <Typography>Checkout successful!</Typography>
      </h2>
      <Button
        variant="contained"
        color="primary"
        onClick={() => ReturnToReservations(router)}
      >
        Return to reservations
      </Button>
    </Container>
  );
}

export default CheckoutSuccessPage;
