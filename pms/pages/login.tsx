import LoginProviders from "../../common/components/auth/login-providers";

/**
 * The login page of the PMS application, which is a wrapper for the {@link LoginProviders} component.
 * @returns The PMS login page.
 */
function Login(): JSX.Element {
  return <LoginProviders />;
}

export default Login;
