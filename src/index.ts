import { PrismaClient } from '@prisma/client'
import express, { Router } from 'express'
import * as joi from 'joi'
import { REST } from './rest'
import logger from 'node-color-log';
import { generateSchema } from './validation'
import dotenv from 'dotenv';
import { generateRelation } from './relation';
import Crypto from "crypto"
import cors from "cors"

dotenv.config();
export const env: any = process.env

const app = express()
app.use(cors())

const prisma = new PrismaClient()

app.use((req,res,next)=>{(req as any).id = Crypto.randomUUID(); next()});
app.use(express.json())

interface EntityValidation {
  [key:string]: joi.ObjectSchema
}

interface EntityRelation {
    [key:string]: boolean
  }

interface Entities {
  [key:string]: keyof PrismaClient
}

type ConfigEntities = {
    [key:string]: {
        get:boolean,
        post:boolean,
        update:boolean,
        delete:boolean
    }
}

export const generateRestRoutes = (router: Router, models: Entities) => {
    Object.keys(models).forEach(model => {
        const Model = models[model]
        const validation = generateSchema(model)
        const relations = generateRelation(model)
        
        class GeneratedREST extends REST<any> {
            constructor(prisma: PrismaClient) {
                super(prisma, Model,validation, relations)
                this.entity = model as keyof PrismaClient
            }
        }

        logger.info(`create route for ${model} : /${model}`)
        const generatedRoutes = new GeneratedREST(prisma)
        router.get(`/${model}`, generatedRoutes.findAll.bind(generatedRoutes))
        router.get(`/${model}/:id`, generatedRoutes.findById.bind(generatedRoutes))
        router.post(`/${model}`, generatedRoutes.create.bind(generatedRoutes))
        router.put(`/${model}/:id`, generatedRoutes.update.bind(generatedRoutes))
        router.delete(`/${model}/:id`, generatedRoutes.delete.bind(generatedRoutes))
    })
}

/**
 * Entities that will not be in the api which are only used localy
 * TODO: for some of them it can be interesting to have a default root user that can use them
 */
//const internalEntities:string[] = ["role","route","propertyAccess"]
const internalEntities:string[] = []

const routes:Entities = {}
for (const key in prisma) {
    if(key[0] != "_" && key[0] != "$" && !internalEntities.includes(key)){
        routes[key] = key as keyof PrismaClient;
    }
}

generateRestRoutes(
    app,
    routes,
)

app.listen(3000, async () => {
    logger.info(`Server started on http://localhost:3000`)
});