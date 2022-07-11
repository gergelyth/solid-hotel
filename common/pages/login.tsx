import LoginProviders from "../components/auth/login-providers";

/**
 * Provides the option for the user to either log-in or log-out, depending on their current state.
 * @returns A button either triggering the log-in or log-out process.
 */
function Login(): JSX.Element {
  return <LoginProviders />;
}

export default Login;
