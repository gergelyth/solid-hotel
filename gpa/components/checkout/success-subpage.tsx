import { useRouter } from "next/router";
import { Box, Button, Typography } from "@material-ui/core";
import { CheckoutPage } from "../../pages/checkout";

//TODO should unify all success subpages
function CheckoutSuccessPage({
  currentPage,
}: {
  currentPage: CheckoutPage;
}): JSX.Element | null {
  const router = useRouter();

  if (currentPage !== CheckoutPage.Success) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h5">Checkout successful!</Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push("/reservations")}
      >
        Return to reservations
      </Button>
    </Box>
  );
}

export default CheckoutSuccessPage;
