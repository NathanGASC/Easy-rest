import { PrismaClient, ER_Role, ER_Route, ER_User } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient()

async function createAsk(ask:string) {
    console.log(`ask:${ask} ...`)
    return await prisma.ask.create({
        "data":{
            "ask": ask
        }
    })
}

async function createResponse(response:string) {
    console.log(`response:${response} ...`)
    return await prisma.response.create({
        "data":{
            "response": response
        }
    })
}

async function connectAskToResponse(askId: number, responseId: number) {
    console.log(`connect ${askId} and ${responseId} ...`)
    return await prisma.ask.update({
        "where":{
            "id":askId
        },
        "data":{
            "Response":{
                "connect":{
                    "id":responseId
                }
            }
        }
    })
}

async function populate() {
    const ask1 = await createAsk("Comment créer une API ?")
    const response1 = await createResponse(`Pour créer une API, vous pouvez suivre les étapes suivantes : Définissez votre objectif : Avant de créer une API, vous devez comprendre pourquoi vous avez besoin de cette API et ce que vous voulez qu'elle réalise. Quel est le but de l'API ? Qui sont les utilisateurs de l'API ? Quels sont les types de données que vous allez fournir via l'API ? Conception de l'API : Une fois que vous avez défini votre objectif, vous pouvez concevoir l'API en déterminant les endpoints, les méthodes HTTP (GET, POST, PUT, DELETE) et les formats de données (JSON, XML) que vous allez utiliser. Choisissez une plate-forme de développement : Vous pouvez utiliser n'importe quelle plate-forme de développement pour créer une API. Les langages de programmation couramment utilisés pour les API sont Java, Python, Node.js, Ruby, PHP, etc. Implémentation de l'API : Une fois que vous avez choisi une plate-forme de développement, vous pouvez commencer à écrire le code pour votre API. Vous pouvez utiliser des frameworks comme Express (pour Node.js), Flask (pour Python), Spring (pour Java) pour faciliter le développement de votre API. Testez l'API : Testez votre API en utilisant des outils de test d'API pour vous assurer que l'API fonctionne correctement. Documentation de l'API : Une fois que votre API fonctionne correctement, documentez votre API en fournissant des instructions sur la façon d'utiliser l'API et en fournissant des exemples de code. Publier l'API : Une fois que vous avez testé et documenté votre API, publiez-la sur une plate-forme de développement ou de déploiement. Vous pouvez utiliser des services cloud tels que AWS, Azure ou Google Cloud pour héberger votre API.En suivant ces étapes, vous pouvez créer votre propre API.`)
    await connectAskToResponse(ask1.id,response1.id)

    const ask2 = await createAsk("Qu'es qu'un microservice ?")
    const response2 = await createResponse(`Un microservice est une architecture logicielle qui consiste à découper une application en un ensemble de services autonomes, indépendants les uns des autres, et fonctionnant ensemble pour offrir une fonctionnalité globale. Chaque microservice est un module fonctionnel qui s'occupe d'une tâche spécifique de l'application. Par exemple, un microservice pourrait être responsable de la gestion des utilisateurs, un autre de la gestion des paiements, un autre encore de la gestion des produits, etc. Les microservices sont souvent construits autour de la notion de « single responsibility principle » (principe de responsabilité unique) qui signifie qu'un module doit avoir une seule responsabilité. Cette approche permet de créer des services plus petits et plus spécialisés, plus facilement modifiables et plus facilement déployables indépendamment les uns des autres. Les microservices offrent de nombreux avantages, notamment la scalabilité, la flexibilité, la résilience et la facilité de déploiement. Ils sont également plus adaptés aux environnements cloud et aux architectures distribuées. Cependant, l'implémentation de microservices peut être plus complexe que les architectures monolithiques traditionnelles, nécessitant une coordination et une communication accrues entre les différents services.`)
    await connectAskToResponse(ask2.id,response2.id)

    const ask3 = await createAsk("Pourquoi vous répondez pas à ma question ?")

    const ask4 = await createAsk("Pain au chocolat ou chaucolatine ?")
    const response4 = await createResponse(`La réponse dépend de la région dans laquelle vous vous trouvez en France. Dans certaines régions, on utilise le terme "pain au chocolat" pour désigner cette pâtisserie, tandis que dans d'autres régions, on préfère utiliser le terme "chocolatine". Il n'y a pas de réponse objective ou scientifique à cette question, c'est une question de préférence personnelle et culturelle.`)
    await connectAskToResponse(ask4.id,response4.id)

    const ask5 = await createAsk("Sandwitch ou tartine ?")
    const response5 = await createResponse(`Un sandwich est une préparation culinaire constituée de deux tranches de pain entre lesquelles on dispose différents ingrédients (viande, fromage, légumes, etc.), tandis qu'une tartine consiste en une tranche de pain recouverte d'une garniture. La principale différence entre les deux est donc la présence de deux tranches de pain dans le sandwich, qui permettent de maintenir les ingrédients à l'intérieur et de les manger plus facilement à la main, alors que la tartine est généralement consommée à l'aide d'un couteau et d'une fourchette. Cela dit, il s'agit encore une fois d'une question de préférence personnelle et culturelle. En fonction de l'endroit où l'on se trouve, on peut avoir tendance à privilégier l'un ou l'autre.`)
    await connectAskToResponse(ask5.id,response5.id)
}

populate()