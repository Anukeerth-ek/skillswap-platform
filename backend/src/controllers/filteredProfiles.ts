import { Request, Response } from "express";
import pool from "../config/db"; // PostgreSQL pool

export const getAllProfiles = async (req: Request, res: Response) => {
  const { search, company, professional, experience, sort } = req.query;
console.log("frm backend search", search,  )
console.log("frm backend company", company )
console.log("frm backend professional",  professional )
console.log("frm backend experience",  experience,  )
console.log("frm backend sort",  sort )
  let query = `
    SELECT u.id, u.name, u.email, u."createdAt",
           u."avatarUrl", 
           co.organization AS company,
           es.years AS experience_years,
           json_agg(DISTINCT s.name) AS skills_offered
    FROM "User" u
    LEFT JOIN "UserCurrentOrganization" co ON co."userId" = u.id
    LEFT JOIN "UserExperienceSummary" es ON es."userId" = u.id
    LEFT JOIN "_SkillsOffered" us ON us."A" = u.id  -- junction table from Prisma
    LEFT JOIN "Skill" s ON s.id = us."B"
    WHERE 1=1
  `;

  const values: any[] = [];
  let i = 1;

  // 🔍 Search by name or skill
  if (search) {
    query += ` AND (LOWER(u.name) LIKE $${i} OR LOWER(s.name) LIKE $${i})`;
    values.push(`%${(search as string).toLowerCase()}%`);
    i++;
  }

  // 🔍 Company filter
  if (company) {
    query += ` AND LOWER(co.organization) LIKE $${i}`;
    values.push(`%${(company as string).toLowerCase()}%`);
    i++;
  }

  // 🔍 Professional filter (skills)
  if (professional) {
    const profs = (professional as string).split(",");
    query += ` AND s.name = ANY($${i}::text[])`;
    values.push(profs);
    i++;
  }

  // 🔍 Experience filter
  if (experience) {
    const exps = (experience as string).split(",");
    const expClauses: string[] = [];
    for (const range of exps) {
      if (range.includes("-")) {
        const [min, max] = range.split("-").map(Number);
        expClauses.push(`es.years BETWEEN $${i} AND $${i + 1}`);
        values.push(min, max);
        i += 2;
      } else if (range.endsWith("+")) {
        const min = parseInt(range);
        expClauses.push(`es.years >= $${i}`);
        values.push(min);
        i++;
      }
    }
    if (expClauses.length) {
      query += ` AND (${expClauses.join(" OR ")})`;
    }
  }

  // ✅ Group by user to avoid duplicates
  query += ` GROUP BY u.id, co.organization, es.years`;

  // 🔍 Sorting
  if (sort === "least-experienced") {
    query += ` ORDER BY es.years ASC NULLS LAST`;
  } else if (sort === "recent-added-profile") {
    query += ` ORDER BY u."createdAt" DESC`;
  } else {
    // default: most experienced
    query += ` ORDER BY es.years DESC NULLS LAST`;
  }

  try {
    const { rows } = await pool.query(query, values);
    res.json({ users: rows });
  } catch (err) {
    console.error("❌ DB Error:", err);
    res.status(500).json({ error: "Database error" });
  }
};
