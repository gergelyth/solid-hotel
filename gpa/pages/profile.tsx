import { ProfileMain } from "../../common/components/profile/profile-main";
import {
  CircularProgress,
  Container,
  Box,
  Typography,
} from "@material-ui/core";
import { useRouter } from "next/router";
import { GetSession } from "../../common/util/solid";
import { ShowWarningSnackbar } from "../../common/components/snackbar";
import { useRequiredFields } from "../../common/hooks/useMockApi";
import { ErrorComponent } from "../../common/components/error-component";

/**
 * The GPA wrapper around the profile editor component described in {@link ProfileMain}.
 * Retrieves the required fields which must be present based on the guest's nationality and the hotel's location and allows the user to modify these fields.
 * @returns A component wrapping the {@link ProfileMain} component with GPA specific actions.
 */
function Profile(): JSX.Element | null {
  const router = useRouter();

  const webId = GetSession().info.webId;
  const requiredFields = useRequiredFields(undefined, webId);

  if (!webId) {
    ShowWarningSnackbar("User not logged in. Redirecting...");
    router.push("/login");
    return null;
  }

  if (requiredFields.isLoading) {
    return <CircularProgress />;
  }

  if (!requiredFields.data || requiredFields.isError) {
    return <ErrorComponent />;
  }

  return (
    <Container>
      <Box textAlign="center" sx={{ mb: 4 }}>
        <Typography variant="h4">Your profile</Typography>
      </Box>
      <ProfileMain
        rdfFields={requiredFields.data}
        webId={webId}
        editable={true}
        deletable={true}
        centerJustify={true}
      />
    </Container>
  );
}

export default Profile;
