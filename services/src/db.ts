import knex, { Knex } from "knex";

class Db {
  db: Knex | null = null;
  constructor() {
    this.connect();
  }
  async connect() {
    try {
      this.db = knex({
        client: "mysql2",
        connection: {
          host: "localhost",
          port: 3306,
          user: "root",
          password: "Deepak@123",
          database: "dteagritech",
        },
        debug: true,
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
