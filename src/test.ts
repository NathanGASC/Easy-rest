/**
 * To run this test, you should first follow the README.md to create the database with Prisma.
 */

import express from "express"
import { ParsePageError, PrismApiREST, ValidationError } from "./index"
import { Prisma, PrismaClient } from '@prisma/client'
import joi from "joi"
import _ from "lodash"
import { color } from "console-log-colors"

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
            //log error class name by using prototype
            var prismaDocUrl = "https://www.prisma.io/docs/reference/api-reference/error-reference"
            var httpError:any = {}
            var isPrismaError = true
            var isImportantError = false

            switch (error.constructor) {
                case Prisma.PrismaClientKnownRequestError:
                    error.status = 400
                    httpError = {
                        error_name: "PrismaClientKnownRequestError",
                        error_meta: error.meta,
                        error_href: `${prismaDocUrl}/#${"PrismaClientKnownRequestError".toLowerCase()}`,
                        error_code: error.code,
                        error_code_href: `${prismaDocUrl}/#${error.code.toLowerCase()}`,
                        client_version: error.clientVersion,
                    }
                break;
                case Prisma.PrismaClientUnknownRequestError:
                    httpError = {
                        error_name: "PrismaClientUnknownRequestError",
                        error_href: `${prismaDocUrl}/#${"PrismaClientUnknownRequestError".toLowerCase()}`,
                        client_version: error.clientVersion,
                    }
                break;
                case Prisma.PrismaClientValidationError:
                    httpError = {
                        error_name: "PrismaClientValidationError",
                        error_href: `${prismaDocUrl}/#${"PrismaClientValidationError".toLowerCase()}`,
                        client_version: error.clientVersion,
                    }
                break;
                case Prisma.PrismaClientInitializationError:
                    error.status = 400
                    httpError = {
                        error_name: "PrismaClientInitializationError",
                        error_href: `${prismaDocUrl}/#${"PrismaClientInitializationError".toLowerCase()}`,
                        error_code: error.code,
                        error_code_href: `${prismaDocUrl}/#${error.code.toLowerCase()}`,
                        client_version: error.clientVersion,
                    }
                break;
                case Prisma.PrismaClientRustPanicError:
                    httpError = {
                        error_name: "PrismaClientValidationError",
                        error_href: `${prismaDocUrl}/#${"PrismaClientValidationError".toLowerCase()}`,
                        client_version: error.clientVersion,
                    }
                break;
                case ParsePageError:
                case ValidationError:
                    httpError = {
                        error_name: error.name,
                        error_message: error.message
                    }
                    isPrismaError = false
                    break;
                default:
                    isImportantError = true
                    isPrismaError = false
                    httpError = {
                        error_name: error.name || "UnknownError",
                        error_message: error.message
                    }
            }

            if(isPrismaError){
                //Error that come from prisma. They generally come from bad user Request or database constraint. 
                //We log them in gray as they are not important to us but can still be usefull to debug
                console.error(color.gray("------------------ START   Prisma Error ------------------"))
                console.error(color.gray(error))
                console.error(color.gray("------------------ END     Prisma Error ------------------"))
            }else if(isImportantError){
                //Some error will come from prismapirest itself. They generally come from bad user Request, and we want
                //to log them in gray as they are not important to us but can still be usefull to debug
                console.error(color.gray(error))
            }else{
                //Other error are important because we don't know them, so they are unexpected errors.
                console.error(color.red(error.stack))
            }
            
            res.status(error.status || 500).json(httpError)
        }
    }
}))

const port = 3000
app.listen(port,()=>{
    console.log(`Server listen on port ${port}`)
})