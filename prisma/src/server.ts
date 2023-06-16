import { PrismaClient, Product } from "@prisma/client";


const prisma = new PrismaClient()

async function main(){
    const result = await prisma.product.create({
        data: {
            description: "description",
            title: "title",
            price: 1000,
        }
    }) 

    console.log("Result: " , result)
}

await main()

 