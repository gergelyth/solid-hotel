import ProfileMain from "../../../common/components/profile/profile-main";
import { useRequiredFields } from "../../../common/hooks/useMockApi";
import {
  Box,
  CircularProgress,
  Grid,
  Link,
  Typography,
} from "@material-ui/core";
import { Dispatch, SetStateAction, useState } from "react";
import ConfirmRequiredFieldsButton from "../../../common/components/profile/required-fields-button";
import { CheckinPage } from "../../pages/reservations/[id]";
import TocPopup from "./toc-popup";
import { GetSession } from "../../../common/util/solid";
import { ShowErrorSnackbar } from "../../../common/components/snackbar";
import { CacheProfile } from "../../../common/util/tracker/profileCache";
import ErrorComponent from "../../../common/components/error-component";

function RequiredFieldsAtCheckin({
  currentPage,
  setCurrentPage,
  executeCheckin,
}: {
  currentPage: CheckinPage;
  setCurrentPage: Dispatch<SetStateAction<CheckinPage>>;
  executeCheckin: () => () => void;
}): JSX.Element | null {
  //TODO this bothers the user even during the room selection
  const { data, isLoading, isError } = useRequiredFields();

  const [isTermsPopupShowing, setTermsPopupVisibility] = useState(false);

  //TODO if there is an error in log then call hooks always here, but add a parameter condition in it to return null if false
  if (currentPage !== CheckinPage.RequiredFields) {
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

  async function ProceedButtonClick(rdfFields: string[]): Promise<void> {
    if (!webId) {
      console.log("Null webId, can't cahe fields");
      return;
    }
    await CacheProfile(webId, rdfFields);

    executeCheckin();
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
        <Typography variant="h4">Check-in</Typography>
      </Grid>
      <Grid item>
        <Typography variant="subtitle2">
          <Box mx={3} textAlign="center">
            By clicking Proceed, you agree to the points set out in our{" "}
            <Link onClick={() => setTermsPopupVisibility(true)}>
              Terms and conditions
            </Link>{" "}
            document.
          </Box>
        </Typography>
      </Grid>
      <Grid item>
        <Typography>
          <Box fontWeight="fontWeightBold">Required personal information</Box>
        </Typography>
      </Grid>
      <Grid item>
        <ProfileMain rdfFields={data} />
      </Grid>
      <Grid item>
        <ConfirmRequiredFieldsButton
          onClickFunction={() => ProceedButtonClick(data)}
          rdfFields={data}
          webId={webId}
          onMount={() => undefined}
        />
      </Grid>
      <TocPopup
        isPopupShowing={isTermsPopupShowing}
        setPopupVisibility={setTermsPopupVisibility}
      />
    </Grid>
  );
}

export default RequiredFieldsAtCheckin;
