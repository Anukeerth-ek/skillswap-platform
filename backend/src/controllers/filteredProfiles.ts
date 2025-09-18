import { Request, Response } from "express";
import pool from "../config/db"; // your PostgreSQL pool connection

export const getAllProfiles = async (req: Request, res: Response) => {
  const { search, company, professional, experience, sort } = req.query;

  let query = `SELECT * FROM users WHERE 1=1`;
  const values: any[] = [];
  let i = 1;

  if (search) {
    query += ` AND LOWER(name) LIKE $${i}`;
    values.push(`%${(search as string).toLowerCase()}%`);
    i++;
  }

  if (company) {
    query += ` AND LOWER(company) LIKE $${i}`;
    values.push(`%${(company as string).toLowerCase()}%`);
    i++;
  }

  if (professional) {
    const profs = (professional as string).split(",");
    query += ` AND professional_type = ANY($${i}::text[])`;
    values.push(profs);
    i++;
  }

  if (experience) {
    const exps = (experience as string).split(",");
    const expClauses: string[] = [];
    for (const range of exps) {
      if (range.includes("-")) {
        const [min, max] = range.split("-").map(Number);
        expClauses.push(`experience_years BETWEEN $${i} AND $${i + 1}`);
        values.push(min, max);
        i += 2;
      } else if (range.endsWith("+")) {
        const min = parseInt(range);
        expClauses.push(`experience_years >= $${i}`);
        values.push(min);
        i++;
      }
    }
    query += ` AND (${expClauses.join(" OR ")})`;
  }

  if (sort === "least-experienced") {
    query += ` ORDER BY experience_years ASC`;
  } else {
    query += ` ORDER BY experience_years DESC`;
  }

  try {
    const { rows } = await pool.query(query, values);
    res.json({ users: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};
