import { Session } from "@inrupt/solid-client-authn-browser";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";

export async function CheckIfLoggedIn(): Promise<boolean> {
  const session = getDefaultSession();
  await session.handleIncomingRedirect(window.location.href);
  const isLoggedIn = session.info.isLoggedIn;
  return isLoggedIn;
}

export function GetSession(): Session {
  return getDefaultSession();
}
