import { Request } from "express"
import _ from "lodash"

/**
 * Get the where query from the request and remove custom query which is used by the api (like p for page) 
 * @param req the express request
 */
export function requestGetWhereQuery(req: Request){
    var where:any = req.query
    var apiQuery = ["p"]
    var whereParsed = requestParseToQueryInt(req)
    where = _.merge(where, whereParsed)
    where = _.omit(where, apiQuery)
    return where
}

/**
 * Try to parse every query to int and return them
 * @param req 
 */
export function requestParseToQueryInt(req: Request){
    var where:any = req.query
    for (const key in where) {
        try{
            where[key] = parseIntOrFail(where[key] as string)
        }catch(e){}
    }
    return where
}

/**
 * Get the page number from the request
 * @param url the express request
 * @returns the page number or undefined if not found.
 * @throws ParsePageError if the page number is not a number
 */
export function requestGetPage(url: Request): number|undefined{
    try{
        if(url.query.p) return parseIntOrFail(url.query.p as string)
        return undefined
    }catch(e){
        throw new ParsePageError(`"${url.query.p}" is not a valid page number`)
    }
}

/**
 * Parse a string to int or throw an error
 * @param int the string to parse
 * @returns the int
 * @throws ParseIntError if the string can't be parsed to int (if it become NaN)
 */
export function parseIntOrFail(int: string){
    try{
        var parsedInt = parseInt(int)
        if(isNaN(parsedInt)) throw new Error()
        return parsedInt
    }catch(e){
        throw new ParseIntError(`"${int}" is not a number and can't be parsed to int`) 
    }
}

export class ParseIntError extends Error{
    status = 400
    constructor(message:string){
        super(message)
        this.name = "ParseIntError"
    }
}

export class ParsePageError extends Error{
    status = 400
    constructor(message:string){
        super(message)
        this.name = "ParsePageError"
    }
}

export class ValidationError extends Error{
    status = 400
    constructor(message:string){
        super(message)
        this.name = "ValidationError"
    }
}