/**
 * To run this test, you should first follow the README.md to create the database with Prisma.
 */

import express from "express"
import { PrismApiREST } from "./index"
import { PrismaClient } from '@prisma/client'
import joi from "joi"

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
        },
        "onSQLFail": (error:any,req:express.Request,res:express.Response)=>{
            //Here we customize the error message when a SQL error happen. It's a good idea to not display SQL error to the user in release for security reason.
            res.json({
                error: error.toString()
            })
        }
    }
}))

const port = 3000
app.listen(port,()=>{
    console.log(`Server listen on port ${port}`)
})