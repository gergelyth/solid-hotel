import Router from "next/router";
import { CheckIfLoggedIn } from "../../util/solid";

/**
 * Moves the user to the index page if they are logged in.
 */
export default function RedirectComponent(): JSX.Element {
  CheckIfLoggedIn().then((isLoggedIn) => {
    if (isLoggedIn) {
      Router.push("/");
    }
  });
  return <div />;
}
