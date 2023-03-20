import { prisma, Prisma, PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import joi, { array } from "joi"
import logger from 'node-color-log'
import _, { isArray } from "lodash"
import { env } from '.'

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
            const propertyAccessAuthorized = await this.checkPermission((req as any).id,req.headers.authorization?.replace(/Bearer.{0,1}/, "") as string|undefined, req.path, req.method)
            if(!isArray(propertyAccessAuthorized)) {
                res.status(403).send()
                return;
            }
            let entities:any;
            if(this.relations){
                entities = await (this.prisma[this.entity] as any).findMany({include:this.relations})
            }else{
                entities = await (this.prisma[this.entity] as any).findMany()
            }
            this.removeKeysDeep(entities, propertyAccessAuthorized)
            res.json(entities)
        } catch (error) {
            this.onSQLFail(error,req,res)
        }
    }

    async findById(req: Request, res: Response) {
        logger.debug(`${(req as any).id} : findById ${this.entity}`)

        try{
            const propertyAccessAuthorized = await this.checkPermission((req as any).id,req.headers.authorization?.replace(/Bearer.{0,1}/, "") as string|undefined, req.path, req.method)
            if(!isArray(propertyAccessAuthorized)) {
                res.status(403).send()
                return;
            }

            const { id } = req.params
            if(!id) return res.json({error: "no id given"})
            const entity = await (this.prisma[this.entity] as any).findUnique({ where: {  id:parseInt(id) }, include: this.relations })
            this.removeKeysDeep(entity, propertyAccessAuthorized)
            res.json(entity)
        } catch (error) {
            this.onSQLFail(error,req,res)
        }
    }

    async create(req: Request, res: Response) {
        logger.debug(`${(req as any).id} : create ${this.entity}`)
        try{
            const propertyAccessAuthorized = await this.checkPermission((req as any).id,req.headers.authorization?.replace(/Bearer.{0,1}/, "") as string|undefined, req.path, req.method)
            if(!isArray(propertyAccessAuthorized)) {
                res.status(403).send()
                return;
            }

            const {error} = this.validation.validate(req.body)
            if(error){
                res.json({error: error.message})
                return 
            }  
            const data = req.body as T
            const entity = await (this.prisma[this.entity] as any).create({ data })
            this.removeKeysDeep(entity, propertyAccessAuthorized)
            res.json(entity)
        } catch (error) {
            this.onSQLFail(error,req,res)
        }
    }

    async update(req: Request, res: Response) {
        logger.debug(`${(req as any).id} : update ${this.entity}`)
        
        try{
            const propertyAccessAuthorized = await this.checkPermission((req as any).id,req.headers.authorization?.replace(/Bearer.{0,1}/, "") as string|undefined, req.path, req.method)
            if(!isArray(propertyAccessAuthorized)) {
                res.status(403).send()
                return;
            }

            const {error} = this.validation.validate(req.body)
            if(error){
                res.json({error: error.message})
                return 
            }
            const { id } = req.params
            if(!id) return res.json({error: "no id given"})
            const data = req.body as T
            const entity = await (this.prisma[this.entity] as any).update({ where: { id:parseInt(id) }, data })
            this.removeKeysDeep(entity, propertyAccessAuthorized)
            res.json(entity)
        } catch (error) {
            this.onSQLFail(error,req,res)
        }
    }

    async delete(req: Request, res: Response) {
        logger.debug(`${(req as any).id} : delete ${this.entity}`)

        try{
            const propertyAccessAuthorized = await this.checkPermission((req as any).id,req.headers.authorization?.replace(/Bearer.{0,1}/, "") as string|undefined, req.path, req.method)
            if(!isArray(propertyAccessAuthorized)) {
                res.status(403).send()
                return;
            }
            
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

    async checkPermission(id:string, api_key:string|undefined, path:string, method:string){
        const reqUser = this.prisma.eR_User.findFirst({where: {api_key:api_key?api_key:null}, include:{
            Role:{
                include:{
                    PropertyAccess:{
                        include:{
                            Route:true
                        }
                    }
                }
            },
        }})
        const user = await reqUser;
        if(!user) {
            logger.error(`${id} : Bearer don't match an existing user`)
            return false;
        }

        logger.debug(`${id} : ${user.login}#${user.id} : have roles`,user.Role.map((role)=>{return role.name}))

        let isPermitted = false;
        let propertyAccessAuthorized:string[] = []

        user.Role.forEach((role)=>{
            role.PropertyAccess.forEach((property)=>{
                if(new RegExp(property.Route.path).test(path) && new RegExp(property.Route.method).test(method)) {
                    logger.debug(`${id} : ${user.login}#${user.id} : role ${role.name} have access to ${property.Route.method} ${property.Route.path}`)
                    isPermitted = true;

                    if(!property.property) return;
                    logger.debug(`${id} : ${user.login}#${user.id} : property to clean for ${role.name} on ${property.Route.path} -> ${property.property}`)
                    propertyAccessAuthorized.push(property.property)
                }

            })
        })


        if(!isPermitted) {
            logger.error(`${id} : ${user.login}#${user.id} : unauthorized`)
            return false;
        }

        logger.debug(`${id} : ${user.login}#${user.id} : property to clean ${propertyAccessAuthorized.map((property)=>property)}`)
        return propertyAccessAuthorized;
    }

    removeKeysDeep(obj: any, pathsToRemove: string[]): any {
        if(obj == undefined) {
            return {};
        }

        if(Array.isArray(obj)){
            const temp: any[] = []
            obj.forEach((subObj)=>{
                temp.push(this.removeKeysDeep(subObj, pathsToRemove))
            })
            return temp;
        }

        pathsToRemove.forEach((pathToRemove)=>{
            const pathToRemoveSplitted = pathToRemove.split(".");
            if(pathToRemoveSplitted.length == 1){
                delete obj[pathToRemoveSplitted[0]]
                return obj;
            }else{
                const savedIndex = pathToRemoveSplitted[0]
                pathToRemoveSplitted.shift()
                return this.removeKeysDeep(obj[savedIndex], [pathToRemoveSplitted.join(".")])
            }
        })
    }
}