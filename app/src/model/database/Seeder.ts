import { getDatabaseClient } from "@/model/database/database-client";

class Seeder {
  private db: PouchDB.Database;

  async seed() {
    if (!this.db) {
      this.db = await getDatabaseClient();
    }
  }
}
