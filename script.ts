import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Function to write queries and all queries in prisma are asyncrhonous
async function main() {
  // prisma client then allows you to access models and run functions on them
  // create takes an object with key called data
  const user = await prisma.user.create({ data: { name: "Sally" } });
  console.log(user);
  const users = await prisma.user.findMany();
  console.log("All users", users);
}

main()
  .catch((e) => console.error(e.message))
  .finally(async () => {
    // good practice to disconnect
    await prisma.$disconnect();
  });
