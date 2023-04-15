import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import joi from "joi";
import { PrismApiREST } from '.';
export declare class REST<T> {
    protected prisma: PrismaClient;
    protected entity: keyof PrismaClient;
    protected validation: joi.ObjectSchema;
    protected relations: {
        [key: string]: boolean;
    } | null;
    protected config: PrismApiREST.Config<T>;
    logger: {
        log: any;
        warn: any;
        error: any;
        debug: any;
        info: any;
    };
    constructor(prisma: PrismaClient, entity: keyof PrismaClient, validation: joi.ObjectSchema, relations: ({
        [key: string]: boolean;
    }) | null, logger?: {
        log: any;
        warn: any;
        error: any;
        debug: any;
        info: any;
    });
    findAll(req: Request, res: Response): Promise<void>;
    findById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    create(req: Request, res: Response): Promise<void>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    delete(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    onSQLFail(error: any, req: Request, res: Response): void;
}
//# sourceMappingURL=rest.d.ts.map