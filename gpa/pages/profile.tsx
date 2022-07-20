import { ProfileMain } from "../../common/components/profile/profile-main";
import {
  CircularProgress,
  Container,
  Box,
  Typography,
} from "@material-ui/core";
import { GetSession } from "../../common/util/solid";
import { useRequiredFields } from "../../common/hooks/useMockApi";
import { ErrorComponent } from "../../common/components/error-component";

/**
 * The GPA wrapper around the profile editor component described in {@link ProfileMain}.
 * Retrieves the required fields which must be present based on the guest's nationality and the hotel's location and allows the user to modify these fields.
 * @returns A component wrapping the {@link ProfileMain} component with GPA specific actions.
 */
function Profile(): JSX.Element | null {
  const webId = GetSession().info.webId;
  const requiredFields = useRequiredFields(undefined, webId);

  if (requiredFields.isLoading) {
    return <CircularProgress />;
  }

  return (
    <Container>
      <Box textAlign="center" sx={{ mb: 4 }}>
        <Typography variant="h4">Your profile</Typography>
      </Box>
      {!requiredFields.data || requiredFields.isError ? (
        <ErrorComponent />
      ) : (
        <ProfileMain
          rdfFields={requiredFields.data}
          webId={webId}
          editable={true}
          deletable={true}
          centerJustify={true}
        />
      )}
    </Container>
  );
}

export default Profile;
