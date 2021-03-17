import Head from "next/head";
import styles from "../../common/styles/Home.module.css";
import RoomList from "../components/rooms/room-list";

function Reservations(): JSX.Element {
  return (
    <div className={styles.container}>
      <Head>
        <title>Room management</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.title}>Room management</h1>

      <RoomList />
    </div>
  );
}

export default Reservations;
