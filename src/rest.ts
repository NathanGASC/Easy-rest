import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import joi from "joi"
import _, { get } from "lodash"
import { requestGetWhereQuery, requestGetPage } from './utils'
import { Config, ValidationError } from '.'

type Key = string | number;
type KeyPath = (string | number)[];

/**
 * A REST class to create a REST API from a prisma client
 */
export class REST<T> {
    protected prisma: PrismaClient
    protected entity: keyof PrismaClient
    protected validation: joi.ObjectSchema
    protected relations: {[key:string]:boolean}|null
    protected config: Config<T>
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
            let page:number|undefined = requestGetPage(req)
            let where:any = requestGetWhereQuery(req)
            let entities:any;

            var defaultRequest = {
            }

            var relation = {
                include: this.relations,
            }

            var pagesRequest = {
                skip: page != null? page*this.config.api.pagination.maxItem : undefined, 
                take: this.config.api.pagination.maxItem
            }

            var whereRequest = {
                where: where
            }

            var finalRequest = defaultRequest
            if(page != null) finalRequest = _.merge(finalRequest, pagesRequest)
            if(where != null) finalRequest = _.merge(finalRequest, whereRequest)
            if(this.relations != null) finalRequest = _.merge(finalRequest, relation)

            this.logger.info(`findAll ${this.entity.toString()} with request ${JSON.stringify(finalRequest)}`)
            entities = await (this.prisma[this.entity] as any).findMany(finalRequest)
            res.json(entities)
        } catch (error) {
            this.onSQLFail(error,req,res)
        }
    }

    async create(req: Request, res: Response) {
        this.logger?.debug(`create ${this.entity.toString()}`)
        try{
            const {error} = this.validation.validate(req.body)
            if(error){
                throw new ValidationError(error.message)
            }  
            const data = req.body as T
            this.logger.info(`create ${this.entity.toString()} with data ${JSON.stringify(data)}`)
            const entity = await (this.prisma[this.entity] as any).create({ data:data })
            res.json(entity)
        } catch (error) {
            this.onSQLFail(error,req,res)
        }
    }

    async update(req: Request, res: Response) {
        this.logger?.debug(`${req.query.id} : update ${this.entity.toString()}`)
        
        try{
            const {error} = this.validation.validate(req.body)
            if(error){
                throw new ValidationError(error.message)
            }
            const { id } = req.query
            if(!id) return res.json({error: "no id given"})
            const data = req.body as T
            this.logger.info(`update ${this.entity.toString()} with data ${JSON.stringify(data)}`)
            const entity = await (this.prisma[this.entity] as any).update({ where: { id:parseInt(id as string) }, data })
            res.json(entity)
        } catch (error) {
            this.onSQLFail(error,req,res)
        }
    }

    async delete(req: Request, res: Response) {
        this.logger?.debug(`${req.query.id} : delete ${this.entity.toString()}`)

        try{            
            const { id } = req.query
            if(!id) return res.json({error: "no id given"})
            await (this.prisma[this.entity] as any).delete({ where: { id:parseInt(id as string) } })
            this.logger.info(`delete ${this.entity.toString()} with id ${id}`)
            res.json({ message: `${this.entity.toString()} deleted` })
        } catch (error) {
            this.onSQLFail(error,req,res)
        }
    }

    onSQLFail(error:any, req: Request, res: Response){
        this.logger.error(error.toString())
    }
}