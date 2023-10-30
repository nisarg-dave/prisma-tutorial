## Prisma Tutorial

After installing Prisma, run this command

```
npx prisma init --datasource-provider postgresql
```

After done with model, migrate for development only and give it a name of init.
This creates a new migration file, which is a sql file and will also Generate Prisma client and puts it in node modules

```
npx prisma migrate dev --name init
```

Everytime you make a migration, the prisma client generated will be updated for you and the client code allows you to interact with the database
But don't have client yet, need to install it.

```
npm i @prisma/client
```
