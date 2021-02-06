import Head from "next/head";
import RoomSelector from "../components/booking/room-selector";
import styles from "../styles/Home.module.css";

function Booking(): JSX.Element {
  return (
    <div className={styles.container}>
      <Head>
        <title>Book a room</title>
        <link rel="icon" href="/favicon.ico" />

        <RoomSelector />
      </Head>
    </div>
  );
}

export default Booking;
