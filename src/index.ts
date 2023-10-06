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
        logger?: { log: any; warn: any; error: any; debug: any; info: any},
        onSQLFail?: (error:any,req:Request,res:Response)=>void
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

/**
 * A REST class to create a REST API from a prisma client. Will create foreach model a route with the following path:
 * - GET /model: get all the model
 * - GET /model/:id: get the model with the id
 * - POST /model: create a new model
 * - PUT /model/:id: update the model with the id
 * - DELETE /model/:id: delete the model with the id
 * 
 * You can tune your request by adding query parameters:
 * - GET /model?p=0: get the first page of the model
 * - GET /model?key=value: get the model where the given key is equal to the given value
 */
export class PrismApiREST<T>{
    rest = function(config:PrismApiREST.Config<T>){
        return (req: Request,res: Response,next: NextFunction)=>{
            const routes: any = {}
            for (const key in config.prisma.client) {
                if (key[0] != "_" && key[0] != "$") {
                    routes[key] = key as keyof T;
                }
            }

            Object.keys(routes).forEach(async model=>{
                if(req.path != `/${model}`) return 
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
                        super(prisma as any, Model as any, validation!!, composer!!, config.api.logger, config.api.onSQLFail)
                        this.entity = model as keyof PrismaClient
                        this.config = config
                    }
                }

                const generatedRoutes = new GeneratedREST(config.prisma.client)
                switch (req.method) {
                    case "GET":
                        await generatedRoutes.findAll(req,res)
                    break;
                    case "POST":
                        await generatedRoutes.create(req,res)
                    break;
                    case "PUT":
                        await generatedRoutes.update(req,res)
                    break;
                    case "DELETE":
                        await generatedRoutes.delete(req,res)
                    break;
                    default:
                        break;
                }
                next()
            })
        }
    }
}