import { PrismaClient } from '@prisma/client'
import express, { NextFunction, Request, Response, Router } from 'express'
import * as joi from 'joi'
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
                        super(prisma as any, Model as any, validation!!, composer!!)
                        this.entity = model as keyof PrismaClient
                    }
                }

                const generatedRoutes = new GeneratedREST(config.prisma.client)
                switch (req.method) {
                    case "GET":
                        const id = req.url.match(/[0-9]*\/?$/)?.[0]
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