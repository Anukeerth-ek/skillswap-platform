import { PrismaClient } from "@prisma/client";
// import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
     // Create Skills
     const jsSkill = await prisma.skill.create({
          data: {
               name: "JavaScript",
               category: "Web Development",
          },
     });

     const reactSkill = await prisma.skill.create({
          data: {
               name: "React",
               category: "Frontend",
          },
     });

     // Create Users
     const mentor = await prisma.user.create({
          data: {
               name: "Alice Mentor",
               email: "alice@example.com",
               password: "hashedpassword1", // Use hashed version in real app
               bio: "Experienced frontend developer",
               avatarUrl: "https://i.pravatar.cc/150?u=alice",
               skillsOffered: {
                    connect: [{ id: jsSkill.id }, { id: reactSkill.id }],
               },
          },
     });

     const learner = await prisma.user.create({
          data: {
               name: "Bob Learner",
               email: "bob@example.com",
               password: "hashedpassword2",
               bio: "Looking to learn React",
               avatarUrl: "https://i.pravatar.cc/150?u=bob",
               skillsWanted: {
                    connect: [{ id: reactSkill.id }],
               },
          },
     });

     // Create a session between Alice (mentor) and Bob (learner)
     await prisma.session.create({
          data: {
               mentorId: mentor.id,
               learnerId: learner.id,
               skill: "React",
               scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
               status: "CONFIRMED",
               feedback: null,
          },
     });

     console.log("✅ Seed data inserted successfully!");
}

main()
     .catch((e) => {
          console.error("❌ Error while seeding:", e);
          process.exit(1);
     })
     .finally(async () => {
          await prisma.$disconnect();
     });
