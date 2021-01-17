import { Session } from "@inrupt/solid-client-authn-browser";

export async function CheckIfLoggedIn(): Promise<boolean> {
  const session = new Session();
  await session.handleIncomingRedirect(window.location.href);
  const isLoggedIn = session.info.isLoggedIn;
  // const fetch = session.fetch;
  return isLoggedIn;
}
