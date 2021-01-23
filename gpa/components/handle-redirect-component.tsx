import { getDefaultSession, Session } from "@inrupt/solid-client-authn-browser";
import Router from "next/router";

async function CheckIfLoggedIn(session: Session): Promise<boolean> {
  await session.handleIncomingRedirect(window.location.href);
  return session.info.isLoggedIn;
}

export default function RedirectComponent(): JSX.Element {
  const session = getDefaultSession();
  CheckIfLoggedIn(session).then((isLoggedIn) => {
    if (isLoggedIn) {
      Router.push("/");
    }
  });
  return <div></div>;
}
