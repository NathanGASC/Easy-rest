import joi from 'joi'
import logger from 'node-color-log';

export const generateSchema = (modelName: string): joi.ObjectSchema => {
    switch (modelName) {
        case 'eR_User':
            return joi.object({
                login: joi.string().required().min(4).max(20).alphanum().token(),
                Role: {
                    connect:{id:joi.number()}
                }
            });
        case 'eR_Role':
            return joi.object({
                name: joi.string().required().token(),
                Route:{
                    create:generateSchema("eR_Route"),
                    connect:{id:joi.number()}
                },
                User:{
                    create:generateSchema("eR_User"),
                    connect:{id:joi.number()}
                },
                PropertyAccess:{
                    create:generateSchema("eR_User"),
                    connect:{id:joi.number()}
                }
            });
        case 'eR_Route':
            return joi.object({
                path: joi.string().required(),
                method: joi.string().required(),
                Role:{
                    connect:{id:joi.number()}
                }
            });
        case 'eR_PropertyAccess':
            return joi.object({
                entity: joi.string().required(),
                Role:{
                    connect:{id:joi.number()}
                }
            });
        case 'ask':
            return joi.object({
                ask: joi.string().required(),
            });
        case 'response':
            return joi.object({
                response: joi.string().required(),
            });
        default:
            logger.warn(`No validation for model "${modelName}". The POST and PUT request will not have validation for this model.`)
            return joi.object({})
    }
}