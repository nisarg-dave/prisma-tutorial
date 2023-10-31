import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Function to write queries and all queries in prisma are asyncrhonous
async function main() {
  // prisma client then allows you to access models and run functions on them
  // create takes an object with key called data
  // const user = await prisma.user.create({ data: { name: "Sally" } });
  // console.log(user);
  // const users = await prisma.user.findMany();
  // console.log("All users", users);

  // Start with an empty database
  await prisma.user.deleteMany();
  // const user = await prisma.user.create({
  //   data: {
  //     name: "Kyle",
  //     email: "kyle@test.com",
  //     age: 27,
  //     // creating user preference
  //     userPreference: {
  //       create: {
  //         emailUpdates: true,
  //       },
  //     },
  //   },
  //   // // adding user preferences to user object, otherwise can't access it
  //   // include: {
  //   //   userPreference: true,
  //   // },
  //   // can be more specific by using select, this will return name and user preference id only (nesting selects)
  //   select: {
  //     name: true,
  //     userPreference: { select: { id: true } },
  //   },
  // });

  // can't use select and include with createMany but essentially creating many users
  // const users = await prisma.user.createMany({
  //   data: [
  //     {
  //       name: "Kyle",
  //       email: "kyle@test.com",
  //       age: 27,
  //     },
  //     {
  //       name: "Sally",
  //       email: "sally@test.com",
  //       age: 32,
  //     },
  //   ],
  // });
  // console.log(users);

  // // finding based on the unique fields only
  // const foundUser = await prisma.user.findUnique({
  //   // where key
  //   where: {
  //     // email: "kyle@test.com",
  //     // block attribute in schema searched like this (special key created called age_name). can't search for age or name individually as no constraint set for them
  //     age_name: {
  //       age: 27,
  //       name: "Kyle",
  //     },
  //   },
  //   // can also do select and include with this
  // });
  // console.log(foundUser);

  // // finding first user
  // const findFirstUser = await prisma.user.findFirst({
  //   where: {
  //     age: 32,
  //   },
  // });
  // console.log(findFirstUser);

  const users = await prisma.user.createMany({
    data: [
      {
        name: "Kyle",
        email: "kyle@test.com",
        age: 27,
      },
      {
        name: "Sally",
        email: "sally@test1.com",
        age: 12,
      },
      {
        name: "Sally",
        email: "sally@test2.com",
        age: 13,
      },
      {
        name: "Sally",
        email: "sally@test3.com",
        age: 32,
      },
    ],
  });

  // const findManyUsers = await prisma.user.findMany({
  //   where: {
  //     name: "Sally",
  //   },
  //   // finding based on distinct name, in this case only first sally returned
  //   // distinct: ["name"],

  //   // pagination
  //   // returns two users
  //   take: 2,
  //   // skip the first sally and get the next two
  //   skip: 1,
  //   // ordering by age
  //   orderBy: {
  //     age: "desc",
  //   },
  // });

  // Advance filtering
  const findManyUsers = await prisma.user.findMany({
    where: {
      // Can create queries inside the object
      // name: { not: "Sally" },
      // users in array
      // name: { in: ["Sally", "Kyle"] },
      // users not in array
      // name: { notIn: ["Sally", "Kyle"] },
      // age less than 20
      // age: { lt: 20 },
      // age greater than or equal 20
      // age: { gte: 20 },
      // contains
      // email: { contains: "@test1.com" }
      // can also user startsWith or endsWith
      // email: { startsWith: "sally" },

      // Relationship filtering,
      // Can also put queries in brackets like above
      writtenPosts: {
        // obviously none of the users will satisfy these conditions as there are no posts and so all returned
        // every: {
        //   title: "Test",
        // },
        // can also do none
        // can also do some
      },
    },
  });

  const posts = await prisma.post.findMany({
    where: {
      author: {
        is: {
          age: 27,
        },
      },
    },
  });

  // console.log(findManyUsers);

  //  Update
  const updatedUser = await prisma.user.update({
    where: {
      email: "sally@test1.com",
    },
    data: {
      email: "sally@test11.com",
    },
    // can also do select and include
  });

  console.log(updatedUser);

  const updatedManyUser = await prisma.user.updateMany({
    where: {
      name: "Sally",
    },
    data: {
      name: "New Sally",
    },
    // can't do select and include -> like createMany
  });

  console.log(updatedManyUser);

  const updatedUser2 = await prisma.user.update({
    where: {
      // has to be a unique field btw
      email: "kyle@test.com",
    },
    data: {
      age: {
        increment: 1,
        // can also decrement, multiply, divide
      },
    },
  });
  console.log(updatedUser2);

  // Connect existing relationships
  const userPreference = await prisma.userPreference.create({
    data: {
      emailUpdates: true,
    },
  });

  console.log(userPreference); // id for this for example is b0be14b2-5efc-4230-b149-134bb845d57c

  // then can do this
  const newUpdate = await prisma.user.update({
    where: {
      email: "kyle@test.com",
    },
    data: {
      userPreference: {
        connect: {
          id: "b0be14b2-5efc-4230-b149-134bb845d57c",
        },
        // can also disconnect to remove user from that id, disconnect: true is what you need, connect is also available in create
      },
    },
  });

  // Delete
  const deleteUser = await prisma.user.delete({
    where: {
      // unique field
      email: "kyle@test.com",
    },
  });
}

main()
  .catch((e) => console.error(e.message))
  .finally(async () => {
    // good practice to disconnect
    await prisma.$disconnect();
  });
