import { Button, Container } from "@material-ui/core";
import { ShowSuccessSnackbar } from "../../common/components/snackbar";

export default function Home(): JSX.Element {
  return (
    <Container maxWidth="sm">
      <Button onClick={() => ShowSuccessSnackbar("Success")}>Snackbar</Button>
    </Container>
  );
}
