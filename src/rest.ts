import { prisma, Prisma, PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import joi, { array } from "joi"
import logger from 'node-color-log'
import _, { isArray } from "lodash"

type Key = string | number;
type KeyPath = (string | number)[];

export class REST<T> {
    protected prisma: PrismaClient
    protected entity: keyof PrismaClient
    protected validation: joi.ObjectSchema
    protected relations: {[key:string]:boolean}|null

    constructor(prisma: PrismaClient, entity: keyof PrismaClient, validation: joi.ObjectSchema, relations:({[key:string]:boolean})|null) {
        this.prisma = prisma
        this.entity = entity
        this.validation = validation
        this.relations = relations
    }

    async findAll(req: Request, res: Response) {
        logger.debug(`${(req as any).id} : findAll ${this.entity}`)
        
        try {
            let entities:any;
            if(this.relations){
                entities = await (this.prisma[this.entity] as any).findMany({include:this.relations})
            }else{
                entities = await (this.prisma[this.entity] as any).findMany()
            }
            res.json(entities)
        } catch (error) {
            this.onSQLFail(error,req,res)
        }
    }

    async findById(req: Request, res: Response) {
        logger.debug(`${(req as any).id} : findById ${this.entity}`)

        try{
            const { id } = req.params
            if(!id) return res.json({error: "no id given"})
            const entity = await (this.prisma[this.entity] as any).findUnique({ where: {  id:parseInt(id) }, include: this.relations })
            res.json(entity)
        } catch (error) {
            this.onSQLFail(error,req,res)
        }
    }

    async create(req: Request, res: Response) {
        logger.debug(`${(req as any).id} : create ${this.entity}`)
        try{
            const {error} = this.validation.validate(req.body)
            if(error){
                res.json({error: error.message})
                return 
            }  
            const data = req.body as T
            const entity = await (this.prisma[this.entity] as any).create({ data })
            res.json(entity)
        } catch (error) {
            this.onSQLFail(error,req,res)
        }
    }

    async update(req: Request, res: Response) {
        logger.debug(`${(req as any).id} : update ${this.entity}`)
        
        try{
            const {error} = this.validation.validate(req.body)
            if(error){
                res.json({error: error.message})
                return 
            }
            const { id } = req.params
            if(!id) return res.json({error: "no id given"})
            const data = req.body as T
            const entity = await (this.prisma[this.entity] as any).update({ where: { id:parseInt(id) }, data })
            res.json(entity)
        } catch (error) {
            this.onSQLFail(error,req,res)
        }
    }

    async delete(req: Request, res: Response) {
        logger.debug(`${(req as any).id} : delete ${this.entity}`)

        try{            
            const { id } = req.params
            if(!id) return res.json({error: "no id given"})
            await (this.prisma[this.entity] as any).delete({ where: { id:parseInt(id) } })
            res.json({ message: `${this.entity} deleted` })
        } catch (error) {
            this.onSQLFail(error,req,res)
        }
    }

    onSQLFail(error:unknown, req: Request, res: Response){
        throw error

        //TODO: probably not a good idea to show those back errors like that. Also, not sure that error is always 400
        res.status(400).send(error)
    }
}