import { PrivacyDashboard } from "../../common/components/privacy-dashboard";
import { PrivacyTokensUrl } from "../../common/consts/solidIdentifiers";
import { Container, Typography, Box } from "@material-ui/core";

function PrivacyDashboardPage(): JSX.Element {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4">
          <Box textAlign="center">Privacy dashboard</Box>
        </Typography>
        <Typography variant="caption">
          <Box fontStyle="italic" textAlign="center">
            Entries with the latest expiry date are highlighted
          </Box>
        </Typography>
      </Box>

      <PrivacyDashboard
        privacyTokenContainerUrl={PrivacyTokensUrl}
        tokenGrouping={(token) => token.guest}
        deleteButton={() => null}
      />
    </Container>
  );
}

export default PrivacyDashboardPage;
