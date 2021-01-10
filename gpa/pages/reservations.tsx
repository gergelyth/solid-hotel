import Head from "next/head";
import styles from "../styles/Home.module.css";
import { InferGetStaticPropsType, GetStaticProps } from "next";

import { query } from "../util/db";

type Reservation = {
  id: number;
  owner_id: number;
  room_definition_id: number;
  state: string;
  dateFrom: string;
  dateTo: string;
};

// TODO: reservations shouldn't be fetched in getStaticProps, this is just a showcase
export const getStaticProps: GetStaticProps = async () => {
  let reservations: Reservation[] = [];
  try {
    reservations = await query<Reservation[]>(
      "SELECT id,owner_id,room_definition_id,state FROM reservation"
    );
  } catch (e) {
    //TODO show error here that no reservations are present!
  }

  return {
    props: {
      reservations,
    },
    revalidate: 1,
  };
};

function Reservations({
  reservations,
}: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element {
  return (
    <div className={styles.container}>
      <Head>
        <title>Reservations</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.title}>Reservations</h1>
      <h2>Reservation count: {reservations.length}</h2>

      <ul>
        {reservations.map((reservation: Reservation) => (
          <li key={reservation.id}>
            ID: {reservation.id} - Owner: {reservation.owner_id} - Room:{" "}
            {reservation.room_definition_id} - State: {reservation.state}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Reservations;
