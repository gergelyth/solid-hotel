import Link from "next/link";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";
import { SolidLogout } from "../../util/solid";
import { useGuest } from "../../hooks/useGuest";

function GetLoginComponent(): JSX.Element {
  return (
    <Link href="/login">
      <h3>Login</h3>
    </Link>
  );
}

function GetLogoutComponent(): JSX.Element {
  async function Logout(): Promise<void> {
    await SolidLogout();
    window.location.reload();
  }

  const { guest, isLoading, isError } = useGuest();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError || !guest) {
    return <div>Error occurred</div>;
  }

  return (
    <div>
      <button
        onClick={async () => {
          await Logout();
        }}
      >
        Logout
      </button>
      <div>Hello {guest.firstName}!</div>
    </div>
  );
}

function LoginButtonComponent(): JSX.Element {
  const session = getDefaultSession();

  return session.info.isLoggedIn ? GetLogoutComponent() : GetLoginComponent();
}

export default LoginButtonComponent;
