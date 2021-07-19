import { PrivacyDashboard } from "../../common/components/privacy-dashboard";
import { PrivacyTokensUrl } from "../../common/consts/solidIdentifiers";

function PrivacyDashboardPage(): JSX.Element {
  return (
    <PrivacyDashboard
      privacyTokenContainerUrl={PrivacyTokensUrl}
      deleteButton={() => null}
    />
  );
}

export default PrivacyDashboardPage;
