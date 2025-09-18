// db.ts
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // optional: add ssl if you're on Neon/Render/Heroku
  // ssl: { rejectUnauthorized: false }
});

export default pool;
