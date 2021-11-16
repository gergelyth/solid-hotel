import { Button } from "@material-ui/core";
import { PrivacyDashboard } from "../../common/components/privacy-dashboard";
import { PrivacyToken } from "../../common/types/PrivacyToken";
import { GetUserPrivacyPodUrl } from "../../common/util/solid";
import { SubmitPrivacyTokenDeletionRequest } from "../util/outgoingCommunications";

function CreateDeleteButton(token: PrivacyToken): JSX.Element {
  return (
    <Button
      variant="contained"
      color="secondary"
      disabled={token.expiry <= new Date()}
      onClick={() => SubmitPrivacyTokenDeletionRequest(token)}
    >
      Send request to delete
    </Button>
  );
}

function PrivacyDashboardPage(): JSX.Element {
  return (
    <PrivacyDashboard
      privacyTokenContainerUrl={GetUserPrivacyPodUrl()}
      tokenGrouping={(token) => token.hotel}
      deleteButton={CreateDeleteButton}
    />
  );
}

export default PrivacyDashboardPage;
