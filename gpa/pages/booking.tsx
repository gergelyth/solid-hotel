import dynamic from "next/dynamic";
import Head from "next/head";
import styles from "../styles/Home.module.css";

const DynamicRoomSelector = dynamic(
  () => import("../components/booking/room-selector")
);

function Booking(): JSX.Element {
  return (
    <div className={styles.container}>
      <Head>
        <title>Book a room</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DynamicRoomSelector />
    </div>
  );
}

export default Booking;
