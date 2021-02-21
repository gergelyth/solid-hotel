import Router from "next/router";
import { CheckIfLoggedIn } from "../../util/solid";

export default function RedirectComponent(): JSX.Element {
  CheckIfLoggedIn().then((isLoggedIn) => {
    if (isLoggedIn) {
      Router.push("/");
    }
  });
  return <div></div>;
}
