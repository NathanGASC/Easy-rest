# EASY REST
Easy rest is here to help you to create a rest api with lesser effort.

## Try it
- install nodejs
- clone the projet `git clone git@github.com:NathanGASC/EasyRest.git`
- run `npm i && npm run prisma && npm run setup && npm start`
- do a GET request on `/user` with this authorization in the header `Bearer b6c9b16c-9dc0-11ed-a8fc-0242ac120002`

## Features
- using Prisma OCR
- request body validation
- database relation in body
- bearer token check
- user group

## Prisma
Prisma is an OCR which make you able to create a database with schema.prisma file in prisma folder. To work well, EASY REST request a minimal prisma file structure which you can find in this readme.

- Update prisma file at `easy rest/prisma/schema.prisma`
- When you update prisma file, run `npm run prisma`

### Minimal prisma file

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = the database type you want, check prisma documentation
  url      = env("DATABASE_URL")
}

model User {
  id       Int     @id @default(autoincrement())
  login    String?
  api_key  String  @default(uuid())
  Role     Role[]
}

model Role {
  id    Int     @id @default(autoincrement())
  name  String
  Route Route[]
  User  User[]
  PropertyAccess PropertyAccess[]
}

model Route {
  id     Int    @id @default(autoincrement())
  path   String
  method String
  Role   Role[]
}

model PropertyAccess {
  id       Int    @id @default(autoincrement())
  property String
  Role Role[]
}
```

## Body validation
Sometime to not say always, you want that value respect some rules, for exemple a password is a mendatory string with minimal length. To help the implementation of those rules, we use Joi library. You can see how it's used in `easy rest/src/validation.ts` and adapt it. You can also watch Joi documentation.

If you forgot to implement validation for a specific entity, a warning will be prompt in the logs at start.

Here an exemple of validation for Car entity. When you want to create a car for exemple, this check that the body have a model which is a string, you have an optional Country which is in relation with Country entity. The body have the choice to create a new Country or connect an existing Country (note that country must also have body validation)
```ts
case 'car':
    return joi.object({
        model: joi.string().required(),
        Country:{
            create:generateSchema("country"),
            connect:{id:joi.number()}
        },
    });
```

## Relation
In some case you want the response to have an entity and his relations. For exemple an user with roles, you want when you fetch an user to also have his roles.

If you want to add relation for entities (by default it will not have relation), go to `easy rest/src/relation.ts` and add relation for your model.

For exemple for our Car entity, we want the Country as relation
```ts
case 'car':
    return {
        "Country":true
    };
```

## Bearer
User entity must have the column "api_key" which contain an UUID. This UUID can be used as a bearer to identify yourself as this user.

## User group
In the prisma file you must have as minimal setup, Role table, PropertyAccess table, Route table. 

- Group : You can define group in role table (for example, admin, root, user, ...). 
- Properties : You can also create regex in PropertyAccess table to erase some keys for given roles like passwords.
- Route : You can define which url a role can request on with which method using regex in Route table.

If you use the Role table, PropertyAccess table, Route table as the minimal prisma file, run `npm run setup` once to fill the database with basic roles, groups and routes. Last things you have to do, create an user and give him the wanted role.