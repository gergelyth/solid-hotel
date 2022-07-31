import { ProfileMain } from "../../../common/components/profile/profile-main";
import { useRequiredFields } from "../../../common/hooks/useMockApi";
import { CircularProgress, Grid, Typography } from "@material-ui/core";
import { BookingPage } from "../../pages/booking";
import { Dispatch, SetStateAction } from "react";
import { ConfirmRequiredFieldsButton } from "../../../common/components/profile/required-fields-button";
import { GetSession } from "../../../common/util/solid";
import { ShowErrorSnackbar } from "../../../common/components/snackbar";
import { ErrorComponent } from "../../../common/components/error-component";
import { PersonFieldToRdfMap } from "../../../common/vocabularies/rdfPerson";

/**
 * Has the responsibility to collect the values for all RDF fields required for booking.
 * The required fields are retrieved from the mock API utility.
 * The proceed button is disabled until every field has a value.
 * When the button is enabled and clicked, we execute the booking operation.
 * @returns A component containing the profile fields and the ability to edit their values and a proceed button which triggers the booking.
 */
export function RequiredFields({
  currentPage,
  setCurrentPage,
  confirmReservation,
}: {
  currentPage: BookingPage;
  setCurrentPage: Dispatch<SetStateAction<BookingPage>>;
  confirmReservation: () => () => void;
}): JSX.Element | null {
  const { data, isLoading, isError } = useRequiredFields();

  if (currentPage !== BookingPage.RequiredFields) {
    return null;
  }

  const webId = GetSession().info.webId;
  if (!webId) {
    ShowErrorSnackbar("Not logged in! WebId is required.");
    return null;
  }

  if (isLoading) {
    return <CircularProgress />;
  }
  if (isError || !data) {
    return <ErrorComponent />;
  }

  function ProceedButtonClick(): void {
    confirmReservation();
    setCurrentPage(currentPage + 1);
  }

  //We always request the email because of our requirements to help track down a user if they disappear
  if (!data.includes(PersonFieldToRdfMap.email)) {
    data.push(PersonFieldToRdfMap.email);
  }

  return (
    <Grid
      container
      spacing={3}
      justifyContent="center"
      alignItems="center"
      direction="column"
    >
      <Grid item>
        <Typography variant="h4">Input required fields</Typography>
      </Grid>
      <Grid item>
        <ProfileMain
          rdfFields={data.filter(
            (fieldRdf: string) => fieldRdf !== PersonFieldToRdfMap.nationality
          )}
        />
      </Grid>
      <Grid item>
        <ConfirmRequiredFieldsButton
          onClickFunction={ProceedButtonClick}
          rdfFields={data}
          webId={webId}
          onMount={() => undefined}
        />
      </Grid>
    </Grid>
  );
}
