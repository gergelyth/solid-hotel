import pgPromise from "pg-promise";

const user = process.env.POSTGRES_USER;
const password = process.env.POSTGRES_PASSWORD;
const host = process.env.POSTGRES_HOST;
const port = process.env.POSTGRES_PORT;
const database = process.env.POSTGRES_DB;

const pgp = pgPromise({});

//from: https://www.codeoftheprogrammer.com/2020/01/16/postgresql-from-nextjs-api-route/
// TODO: find a more elegant solution to avoid issue

// Use a symbol to store a global instance of a connection, and to access it from the singleton.
const DB_KEY = Symbol.for("GPA.db");
const globalSymbols = Object.getOwnPropertySymbols(global);
const hasDb = globalSymbols.includes(DB_KEY);
if (!hasDb) {
  global[DB_KEY] = pgp(
    `postgres://${user}:${password}@${host}:${port}/${database}`
  );
}

// Create and freeze the singleton object so that it has an instance property.
const singleton = {};
Object.defineProperty(singleton, "instance", {
  get: function () {
    return global[DB_KEY];
  },
});
Object.freeze(singleton);

const db = singleton.instance;

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
