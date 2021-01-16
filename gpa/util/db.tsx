import pgPromise from "pg-promise";
import pg from "pg-promise/typescript/pg-subset";

declare global {
  namespace NodeJS {
    interface Global {
      db: pgPromise.IDatabase<pg.IClient>;
    }
  }
}

class DBConnection {
  get(): pgPromise.IDatabase<pg.IClient> {
    return global.db;
  }
}

const user = process.env.POSTGRES_USER;
const password = process.env.POSTGRES_PASSWORD;
const host = process.env.POSTGRES_HOST;
const port = process.env.POSTGRES_PORT;
const database = process.env.POSTGRES_DB;

const pgp = pgPromise({});

//from: https://www.codeoftheprogrammer.com/2020/01/16/postgresql-from-nextjs-api-route/
// TODO: find a more elegant solution to avoid issue

if (global.db != null) {
  global.db = pgp(`postgres://${user}:${password}@${host}:${port}/${database}`);
}

// Create and freeze the singleton object so that it has an instance property.
const singleton: DBConnection = new DBConnection();
Object.freeze(singleton);

const db = singleton.get();

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
