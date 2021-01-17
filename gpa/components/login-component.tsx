import styles from "../styles/Home.module.css";
import Link from "next/link";
import { CheckIfLoggedIn } from "../util/solid";
import { GetSession } from "../util/solid";
import { Component } from "react";

function GetLoginComponent(): JSX.Element {
  return (
    <Link href="/login">
      <h3>Login</h3>
    </Link>
  );
}

function GetLogoutComponent(): JSX.Element {
  async function SolidLogout(): Promise<void> {
    const session = GetSession();
    if (session == null) {
      return;
    }
    await session.logout();
    window.location.reload();
  }

  return (
    <button
      onClick={async () => {
        await SolidLogout();
      }}
    >
      Logout
    </button>
  );
}

// TODO: Put the logged in verification only to /login - if logged in, then redirect to index, if not, then select provider
// just like the example
class LoginButtonComponent extends Component<unknown, { isLoggedIn: boolean }> {
  constructor(props: unknown) {
    super(props);
    this.state = {
      isLoggedIn: false,
    };
  }

  componentDidMount(): void {
    const isLoggedInPromise = CheckIfLoggedIn();
    isLoggedInPromise.then((b) => this.setState({ isLoggedIn: b }));
  }

  render(): JSX.Element {
    return (
      <div className={`${styles.grid} ${styles.card}`}>
        {this.state.isLoggedIn ? GetLogoutComponent() : GetLoginComponent()}
      </div>
    );
  }
}

export default LoginButtonComponent;
