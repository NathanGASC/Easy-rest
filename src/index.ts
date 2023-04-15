import { PrismaClient } from '@prisma/client'
import express, { NextFunction, Request, Response, Router } from 'express'
import joi from 'joi';
import { REST } from './rest'
import logger from 'node-color-log';

export module PrismApiREST{
    export type Config<T> = {
        prisma: PrismaConf<T>,
        api?: ApiConf<T> 
    }

    export type PrismaConf<T> = {
        client: T
    }

    export type ApiConf<T> = {
        validation?: ValidationConf<T>
        composer?: ComposerConf<T>
        pagination?: PaginationConf
        logger?: { log: any; warn: any; error: any; debug: any; info: any}
    }

    export type ValidationConf<T> = {
        [key:string]: joi.ObjectSchema
    }

    export type ComposerConf<T> = {
        [key:string]: any
    }

    export type PaginationConf = {
        maxItem?: number
    }
}

export class PrismApiREST<T>{
    rest = function(config:PrismApiREST.Config<T>){
        return (req: Request,res: Response,next: NextFunction)=>{
            const routes: any = {}
            for (const key in config.prisma.client) {
                if (key[0] != "_" && key[0] != "$") {
                    routes[key] = key as keyof T;
                }
            }

            Object.keys(routes).forEach(model=>{
                if(!req.path.includes(model)) return 
                const Model = config.prisma.client[model as keyof T]
                let validation = config.api?.validation? config.api?.validation[model] : undefined
                let composer = config.api?.composer? config.api?.composer[model] : undefined
        
                if(validation === undefined) {
                    validation = joi.object()
                    logger.warn(`No validation for model "${model}". The POST and PUT request will not have validation for this model.`)
                }

                if(composer === undefined) {
                    logger.warn(`No composer for model "${model}".`)
                }

                class GeneratedREST extends REST<any> {
                    constructor(prisma: T) {
                        super(prisma as any, Model as any, validation!!, composer!!, config.api.logger)
                        this.entity = model as keyof PrismaClient
                        this.config = config
                    }
                }

                const generatedRoutes = new GeneratedREST(config.prisma.client)
                switch (req.method) {
                    case "GET":
                        const { id } = req.query
                        if(id){
                            generatedRoutes.findById(req,res)
                        }else{
                            generatedRoutes.findAll(req,res)
                        }
                        break;
                    case "POST":
                        generatedRoutes.create(req,res)
                    break;
                    case "PUT":
                        generatedRoutes.update(req,res)
                    break;
                    case "DELETE":
                        generatedRoutes.delete(req,res)
                    break;
                    default:
                        break;
                }
            })
        }
    }
}

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