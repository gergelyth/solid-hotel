import styles from "../styles/Home.module.css";
import Link from "next/link";
import { useUserName } from "../hooks/useSolidUser";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";
import { SolidLogout } from "../util/solid";

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

  const { userName, isLoading, isError } = useUserName();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
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
      <div>Hello {userName}!</div>
    </div>
  );
}

function LoginButtonComponent(): JSX.Element {
  const session = getDefaultSession();

  return (
    <div className={`${styles.grid} ${styles.card}`}>
      {session.info.isLoggedIn ? GetLogoutComponent() : GetLoginComponent()}
    </div>
  );
}

export default LoginButtonComponent;
