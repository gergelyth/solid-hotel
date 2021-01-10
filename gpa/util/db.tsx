import pgPromise from "pg-promise";

const user = process.env.POSTGRES_USER;
const password = process.env.POSTGRES_PASSWORD;
const host = process.env.POSTGRES_HOST;
const port = process.env.POSTGRES_PORT;
const database = process.env.POSTGRES_DB;

const pgp = pgPromise({});
export const db = pgp(
  `postgres://${user}:${password}@${host}:${port}/${database}`
);

export async function query<T>(
  q: string,
  values: (string | number)[] | string | number = []
): Promise<T> {
  try {
    const results = await db.query<T>(q, values);
    return results;
  } catch (e) {
    throw Error(e.message);
  }
}
