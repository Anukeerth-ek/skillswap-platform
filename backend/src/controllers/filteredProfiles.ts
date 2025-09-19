import { Request, Response } from "express";
import pool from "../config/db"; // PostgreSQL pool

export const getFilteredProfile = async (req: Request, res: Response) => {
     const { search, company, professional, experience, sort } = req.query;

     let query = `
    SELECT
      u.id,
      u.name,
      u.email,
      u."avatarUrl",
      u."createdAt",
      jsonb_build_object(
        'organization', co.organization
      ) AS "currentOrganization",
      jsonb_build_object(
        'years', es.years,
        'description', es.description
      ) AS "experienceSummary",
      jsonb_build_object(
        'title', pd.title
      ) AS "professionDetails",
      COALESCE(
        jsonb_agg(DISTINCT jsonb_build_object(
          'id', so.id,
          'name', so.name,
          'category', so.category
        )) FILTER (WHERE so.id IS NOT NULL),
        '[]'
      ) AS "skillsOffered",
      COALESCE(
        jsonb_agg(DISTINCT jsonb_build_object(
          'id', sw.id,
          'name', sw.name,
          'category', sw.category
        )) FILTER (WHERE sw.id IS NOT NULL),
        '[]'
      ) AS "skillsWanted"
    FROM "User" u
    LEFT JOIN "UserCurrentOrganization" co ON co."userId" = u.id
    LEFT JOIN "UserExperienceSummary" es ON es."userId" = u.id
    LEFT JOIN "UserProfessionDetails" pd ON pd."userId" = u.id

    -- offered skills (flip join: B = user, A = skill)
    LEFT JOIN "_SkillsOffered" uso ON uso."B" = u.id
    LEFT JOIN "Skill" so ON so.id = uso."A"

    -- wanted skills (flip join: B = user, A = skill)
    LEFT JOIN "_SkillsWanted" usw ON usw."B" = u.id
    LEFT JOIN "Skill" sw ON sw.id = usw."A"

    WHERE 1=1
  `;

     const values: any[] = [];
     let i = 1;

     // 🔍 Search across user + skill names
     if (search) {
          query += ` AND (LOWER(u.name) LIKE $${i} OR LOWER(so.name) LIKE $${i} OR LOWER(sw.name) LIKE $${i})`;
          values.push(`%${(search as string).toLowerCase()}%`);
          i++;
     }

     // 🔍 Filter by company
     if (company) {
          query += ` AND LOWER(co.organization) LIKE $${i}`;
          values.push(`%${(company as string).toLowerCase()}%`);
          i++;
     }

     // 🔍 Filter by professional title (not skill!)
     if (professional) {
          const profs = (professional as string).split(",");
          query += ` AND pd.title = ANY($${i}::text[])`;
          values.push(profs);
          i++;
     }

     // 🔍 Filter by experience ranges
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

     query += `
    GROUP BY u.id, co.organization, es.years, es.description, pd.title
  `;

     // 🔍 Sorting
     if (sort === "least-experienced") {
          query += ` ORDER BY es.years ASC NULLS LAST`;
     } else if (sort === "recent-added-profile") {
          query += ` ORDER BY u."createdAt" DESC`;
     } else {
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
