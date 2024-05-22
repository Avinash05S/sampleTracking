import knex, { Knex } from "knex";
import config from "../../local.config.json";

class Db {
  db: Knex | null = null;
  constructor() {
    this.connect();
  }
  knex() {
    if (this.db) {
      return this.db;
    }
    throw new Error("DB connection Error");
  }
  async connect() {
    try {
      this.db = knex({
        ...config.db,
        // postProcessResponse(result, queryContext) {
        //   console.log(result, queryContext, "postProces");
        //   return result;
        // },
        // wrapIdentifier(value, oriImpl){
        //   console.log(value, "wrapper")
        //   return oriImpl(value)
        // }
      });
      await this.db.raw("Select 1+1;");
      console.log("connection estalished");
    } catch (err) {
      console.log("Connection error", err);
    }
  }
}

const Init = new Db();

export default Init;
