import ProfileMain from "../../../common/components/profile/profile-main";
import { useRequiredFields } from "../../../common/hooks/useMockApi";
import {
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@material-ui/core";
import { BookingPage } from "../../pages/booking";
import { Dispatch, SetStateAction } from "react";
import ConfirmRequiredFieldsButton from "../../../common/components/profile/required-fields-button";

function RequiredFields({
  currentPage,
  setCurrentPage,
  confirmReservation,
}: {
  currentPage: BookingPage;
  setCurrentPage: Dispatch<SetStateAction<BookingPage>>;
  confirmReservation: () => () => void;
}): JSX.Element | null {
  //TODO this bothers the user even during the room selection
  const { data, isLoading, isError } = useRequiredFields();

  //TODO if there is an error in log then call hooks always here, but add a parameter condition in it to return null if false
  if (currentPage !== BookingPage.RequiredFields) {
    return null;
  }

  if (isLoading) {
    return <CircularProgress />;
  }
  if (isError || !data) {
    return (
      <Container maxWidth="sm">
        <Typography>An error occurred.</Typography>
        <Typography>{isError}</Typography>
      </Container>
    );
  }

  function ProceedButtonClick(): void {
    confirmReservation();
    setCurrentPage(currentPage + 1);
  }

  return (
    <Grid
      container
      spacing={3}
      justify="center"
      alignItems="center"
      direction="column"
    >
      <Grid item>
        <Typography variant="h4">Input required fields</Typography>
      </Grid>
      <Grid item>
        <ProfileMain rdfFields={data} />
      </Grid>
      <Grid item>
        <ConfirmRequiredFieldsButton
          onClickFunction={ProceedButtonClick}
          rdfFields={data}
        />
      </Grid>
    </Grid>
  );
}

export default RequiredFields;
