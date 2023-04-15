# PrismApiREST
PrismApiREST is a module which work as a middleware for Express. You need to know how Prisma work first before using this module. This module will use the PrismaClient generated by Prisma to work. PrismApiREST is here to turn a prisma file into a prisma rest api. For each defined model in your prisma file, you will have a route GET, POST, PUT, DELETE to manipulate it.

## How to use
To use PrismApiREST, you will need a express server and a prisma file like below. If you execute this server, you will be able to retreive users at `http://localhost:3000/user`. For now you have no user so you should see an empty array. You can do POST request to create some users.
```typescript
import express from "express"
import { PrismApiREST } from "prismapirest"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const app = express()
app.use(express.json())
app.use(new PrismApiREST().rest({
    //We give the prisma client to the config
    "prisma": {
        "client": prisma
    },
    //We configure the api
    "api":{
        //By seting the composer we set dependencies between models. It's the "include" of prisma. You can find more about it at https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries.
        "composer":{
            //We set that the user model will have a posts field and should contain the Post model. If we don't put this, the user model will not have the posts field
            "user":{
                "posts": true
            },
            //We set that the post model will have a author field and should contain the User model. We also say that the author field should contain the posts field.
            "post":{
                "author": {
                    "include": {
                        "posts": true
                    }
                }
            }
        },
        //We validate the data which are sent in the body of the request.
        "validation":{
            //For example here, an user should have a name & email. Try to do a post request on user without it and you will receive guidance to correct
            "user": joi.object({
                "name": joi.string().required(),
                "email": joi.string().email().required()
            })
        },
        //We set the pagination. Here we set that the max number of item per page is 10. If you ask for the first page with ?p=1 in your request, you will have 10 items max
        "pagination":{
            "maxItem": 10
        },
        //We set a logger. It's a way to enable/disable/customize logs. It's optional, if not defined, no logs will be displayed
        "logger": {
            log: (...msg:string[]) => console.log(`LOG: ${msg.join(" ")}`),
            warn: (...msg:string[]) => console.log(`WARN: ${msg.join(" ")}`),
            error: (...msg:string[]) => console.log(`ERROR: ${msg.join(" ")}`),
            debug: (...msg:string[]) => console.log(`DEBUG: ${msg.join(" ")}`),
            info: (...msg:string[]) => console.log(`INFO: ${msg.join(" ")}`)
        }
    }
}))

const port = 3000
app.listen(port,()=>{
    console.log(`Server listen on port ${3000}`)
})
```

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @default(autoincrement()) @id
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        Int      @default(autoincrement()) @id
  title     String
  content   String?
  published Boolean  @default(false)
  author    User?    @relation(fields: [authorId], references: [id])
  authorId  Int?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

And if you use sqlite don't forget to have something like that in your env file (it's related to Prisma but I put it here as I think it can help some)
```
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL="file:./dev.db"
```