import { Grid, Typography } from "@material-ui/core";
import { DynamicLoginComponent } from "../../common/components/auth/dynamic-login-component";
import { ProfileMain } from "../../common/components/profile/profile-main";
import GetSupportedFields from "../../common/consts/supportedFields";
import { GetSession } from "../../common/util/solid";

/**
 * The index page for the SPE application.
 * Contains the login button and the profile editor for all supported fields.
 * @returns The PMS index page.
 */
export default function Home(): JSX.Element {
  const allRdfFields = GetSupportedFields().map((field) => field.rdfName);
  return (
    <Grid container spacing={8} direction="column">
      <Grid
        item
        container
        spacing={3}
        justifyContent="center"
        alignItems="center"
        direction="column"
      >
        <Grid item>
          <Typography variant="h4">Solid Profile Editor</Typography>
        </Grid>
        <Grid item>
          <DynamicLoginComponent />
        </Grid>
      </Grid>

      {GetSession()?.info.isLoggedIn ? (
        <ProfileMain
          rdfFields={allRdfFields}
          editable={true}
          deletable={true}
          centerJustify={true}
        />
      ) : null}
    </Grid>
  );
}
