import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import joi from "joi"
import _ from "lodash"
import { PrismApiREST } from '.'

type Key = string | number;
type KeyPath = (string | number)[];

export class REST<T> {
    protected prisma: PrismaClient
    protected entity: keyof PrismaClient
    protected validation: joi.ObjectSchema
    protected relations: {[key:string]:boolean}|null
    protected config:PrismApiREST.Config<T>
    logger: { log: any; warn: any; error: any; debug: any; info: any }

    constructor(prisma: PrismaClient, entity: keyof PrismaClient, validation: joi.ObjectSchema, relations:({[key:string]:boolean})|null, logger?: {log:any, warn:any, error:any, debug:any, info:any}, onSQLFail?:(error:any,req:Request,res:Response)=>void) {
        this.prisma = prisma
        this.entity = entity
        this.validation = validation
        this.relations = relations
        this.logger = logger
        this.onSQLFail = onSQLFail || this.onSQLFail
    }

    async findAll(req: Request, res: Response) {
        this.logger?.debug(`findAll ${this.entity.toString()}`)
        
        try {
            let page:number|undefined = undefined
            if(req.query.p) page = parseInt(req.query.p as string)

            let entities:any;
            if(this.relations){
                entities = await (this.prisma[this.entity] as any).findMany({include:this.relations, skip: page? page*this.config.api.pagination.maxItem : undefined, take: this.config.api.pagination.maxItem})
            }else{
                entities = await (this.prisma[this.entity] as any).findMany({skip: page? page*this.config.api.pagination.maxItem : undefined, take: this.config.api.pagination.maxItem})
            }
            res.json(entities)
        } catch (error) {
            this.onSQLFail(error,req,res)
        }
    }

    async findById(req: Request, res: Response) {
        this.logger.debug(`findById ${this.entity.toString()}`)

        try{
            const { id } = req.query
            if(!id) return res.json({error: "no id given"})
            const entity = await (this.prisma[this.entity] as any).findUnique({ where: {  id:parseInt(id as string) }, include: this.relations })
            res.json(entity)
        } catch (error) {
            this.onSQLFail(error,req,res)
        }
    }

    async create(req: Request, res: Response) {
        this.logger?.debug(`create ${this.entity.toString()}`)
        try{
            const {error} = this.validation.validate(req.body)
            if(error){
                res.json({error: error.message})
                return 
            }  
            const data = req.body as T
            const entity = await (this.prisma[this.entity] as any).create({ data:data })
            res.json(entity)
        } catch (error) {
            this.onSQLFail(error,req,res)
        }
    }

    async update(req: Request, res: Response) {
        this.logger?.debug(`${(req as any).id} : update ${this.entity.toString()}`)
        
        try{
            const {error} = this.validation.validate(req.body)
            if(error){
                res.json({error: error.message})
                return 
            }
            const { id } = req.query
            if(!id) return res.json({error: "no id given"})
            const data = req.body as T
            const entity = await (this.prisma[this.entity] as any).update({ where: { id:parseInt(id as string) }, data })
            res.json(entity)
        } catch (error) {
            this.onSQLFail(error,req,res)
        }
    }

    async delete(req: Request, res: Response) {
        this.logger?.debug(`${(req as any).id} : delete ${this.entity.toString()}`)

        try{            
            const { id } = req.query
            if(!id) return res.json({error: "no id given"})
            await (this.prisma[this.entity] as any).delete({ where: { id:parseInt(id as string) } })
            res.json({ message: `${this.entity.toString()} deleted` })
        } catch (error) {
            this.onSQLFail(error,req,res)
        }
    }

    onSQLFail(error:any, req: Request, res: Response){
        this.logger.error(error.toString())
    }
}