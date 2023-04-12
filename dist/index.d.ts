import { NextFunction, Request, Response } from 'express';
import * as joi from 'joi';
export declare module PrismApiREST {
    type Config<T> = {
        prisma: PrismaConf<T>;
        api?: ApiConf<T>;
    };
    type PrismaConf<T> = {
        client: T;
    };
    type ApiConf<T> = {
        validation?: ValidationConf<T>;
        composer?: ComposerConf<T>;
        pagination?: PaginationConf;
    };
    type ValidationConf<T> = {
        [key: string]: joi.ObjectSchema;
    };
    type ComposerConf<T> = {
        [key: string]: any;
    };
    type PaginationConf = {
        maxItem?: number;
    };
}
export declare class PrismApiREST<T> {
    rest: (config: PrismApiREST.Config<T>) => (req: Request, res: Response, next: NextFunction) => void;
}
//# sourceMappingURL=index.d.ts.map