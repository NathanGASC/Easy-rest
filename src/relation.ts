import logger from 'node-color-log';

export const generateRelation = (modelName: string): {[key:string]:boolean}|null => {
    switch (modelName) {
        case 'eR_User':
            return {
                "Role":true
            };
        case 'eR_Role':
            return {
                "User":true,
                "PropertyAccess": true
            };
        case 'eR_Route':
            return {
                "PropertyAccess": true
            };
        case 'eR_PropertyAccess':
            return {
                "Role":true,
                "Route":true
            };
        case 'ask':
            return {
                "Response":true,
            };
        default:
            logger.warn(`No relation for model "${modelName}". No relation will be returned from this model.`)
            return null
    }
}