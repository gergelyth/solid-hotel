import styles from "../styles/Home.module.css";
import Link from "next/link";
import { CheckIfLoggedIn } from "../util/solid";

const LoginButtonComponent = () => {
  const isLoggedIn = CheckIfLoggedIn();

  return (
    <div className={`${styles.grid} ${styles.card}`}>
      <Link href={isLoggedIn ? "/logout" : "/login"}>
        <h3>{isLoggedIn ? "Logout" : "Login"}</h3>
      </Link>
    </div>
  );
};

export default LoginButtonComponent;
