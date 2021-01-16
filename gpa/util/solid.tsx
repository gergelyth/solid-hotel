import React from "react";
import { Session } from "@inrupt/solid-client-authn-browser";

const SolidSession = React.createContext({
  session: new Session(),
});

export default SolidSession;

//   constructor() {
//     console.log("Initializing Session");
//   }

//   public static async CheckIfLoggedIn(): Promise<void> {
//     await SolidUtils.session.handleIncomingRedirect("/asd");
//   }

//   public static IsLoggedIn(): boolean {
//     return SolidUtils.session.info.isLoggedIn;
//   }

//   public static async SolidLogin(oidcIssuer: string): Promise<void> {
//     await SolidUtils.session.login({
//       // Specify the URL of the user's Solid Identity Provider; e.g., "https://inrupt.net"
//       oidcIssuer: oidcIssuer,
//       // Specify the URL the Solid Identity Provider should redirect to after the user logs in,
//       // e.g., the current page for a single-page app.
//       redirectUrl: window.location.origin,
//     });
//   }

//   public static async SolidLogout(): Promise<void> {}
