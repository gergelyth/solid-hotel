import Head from "next/head";
import styles from "../../common/styles/Home.module.css";
import ProfileMain from "../profile/profile-main";

//TODO - to use compare in SWR pass in an extension of the default dequal method to config options compare
// we can call that to compare, do something and return that result
// the issue is how to find out what changed

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
