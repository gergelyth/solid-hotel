import LoginProviders from "../../common/components/auth/login-providers";

/**
 * The login page of the SPE application, which is a wrapper for the {@link LoginProviders} component.
 * @returns The SPE login page.
 */
function Login(): JSX.Element {
  return <LoginProviders />;
}

export default Login;
