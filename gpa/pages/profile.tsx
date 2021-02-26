import styles from "../styles/Home.module.css";
import Head from "next/head";
import ProfileMain from "../components/profile/profile-main";

function Profile(): JSX.Element {
  return (
    <div className={styles.container}>
      <Head>
        <title>Profile</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ProfileMain />
    </div>
  );
}

export default Profile;
