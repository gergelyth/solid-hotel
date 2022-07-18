import { PrivacyDashboard } from "../../common/components/privacy-dashboard";
import { PrivacyTokensUrl } from "../../common/consts/solidIdentifiers";
import { Container, Typography, Box } from "@material-ui/core";
import { useHotelPrivacyTokens } from "../../common/hooks/usePrivacyTokens";

/**
 * The PMS wrapper around the privacy dashboard component described in {@link PrivacyDashboard}.
 * Defines the privacy token retrieval to fetch the hotel privacy tokens from the hotel's privacy container.
 * Groups the privacy tokens by reservation.
 * Doesn't define a request delete button as the PMS doesn't need such.
 * @returns A component wrapping the {@link PrivacyDashboard} component with PMS specific actions.
 */
function PrivacyDashboardPage(): JSX.Element {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }} textAlign="center">
        <Typography variant="h4">Privacy dashboard</Typography>
        <Box fontStyle="italic">
          <Typography variant="caption">
            Entries with the latest expiry date are highlighted
          </Typography>
        </Box>
      </Box>

      <PrivacyDashboard
        retrieval={useHotelPrivacyTokens(PrivacyTokensUrl)}
        tokenGrouping={(token) => token.reservation}
        deleteButton={() => null}
      />
    </Container>
  );
}

export default PrivacyDashboardPage;
