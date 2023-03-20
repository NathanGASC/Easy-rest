import { PrismaClient, ER_Role, ER_Route, ER_User } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient()

async function createUser(login:string, apiKey?:string) {
    console.log(`user:${login}:${apiKey} ...`)
    return await prisma.eR_User.create({
        "data":{
            "api_key": apiKey,
            "login":login,
        }
    })
}

async function createRole(name:string, user:ER_User) {
    console.log(`role:${name}:${user} ...`)
    return await prisma.eR_Role.create({
        "data":{
            "name": name,
            "User": {
                "connect":{
                    "id": user.id
                }
            }
        }
    })
}

async function createRoute(method:string, path:string) {
    console.log(`route:${method}:${path} ...`)
    return await prisma.eR_Route.create({
        "data":{
            "method":method,
            "path":path,
        }
    })
}

async function createPropertyAccess(route:ER_Route, role:ER_Role, property?:string) {
    console.log(`propertyAccess:${route}:${role} ...`)
    return await prisma.eR_PropertyAccess.create({
        "data":{
            "property":property,
            "Route":{
                "connect":{
                    "id":route.id
                }
            },
            "Role":{
                "connect":{
                    "id":role.id
                }
            }
        }
    })
}

/**
 * Setup an user root which can do everythings.
 */
async function setupRootUser() {
    //create a root user with an api key
    const userRoot = await createUser("root",uuidv4())
    //create a root role which is for root user
    const roleRoot = await createRole("root", userRoot)
    //we want to allow every route with every method
    const routeRoot = await createRoute(".*",".*")
    //we connect the route rule to the role without property access rules
    await createPropertyAccess(routeRoot, roleRoot)
}

/**
 * Setup a visitor which can visit everythings on GET route but with minimal property access on user
 */
async function setupVisitorUser() {
    //create a vistor user which don't use api key. Which mean the visitor is the used user if you don't give api key (public api).
    const userVisitor = await createUser("visitor",undefined)
    //create a visitor role
    const roleVisitor = await createRole("visitor", userVisitor)
    //create a rule for visitor, they can use every route except the one used by Easy Rest
    const routeVisitor = await createRoute(".*","^(?!\/eR_.*).*")
    //we connect the other routes with visitor role without hiding any key
    await createPropertyAccess(routeVisitor, roleVisitor)
}

async function main() {
    await setupRootUser()
    await setupVisitorUser()
}

main()