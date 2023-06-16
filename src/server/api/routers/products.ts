import { Product, ProductTranslation } from "@prisma/client";
import { title } from "process";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


const productSchema = z.object({
    title: z.string().nonempty('O título é obrigatório.'),
    description: z.string().nonempty('A descrição é obrigatória.'),
    take: z.number().optional(),
    language: z.string().optional(),
    skip: z.number().optional(),
    id: z.number().optional(),

  });
  const crateProductSchema = z.object({
    price:  z.number({
      required_error: "Preço obrigatório",
      invalid_type_error: "Preço obrigatório",
    }).positive("Preço tem que ser maior que 0"),
 
    image: z.string().nonempty('A image é obrigatória.'),
    language: z.array(productSchema),
    id: z.number().optional(),

  });
  const editProductSchema = z.object({
    price:  z.number({
      required_error: "Preço obrigatório",
      invalid_type_error: "Preço obrigatório",
    }).positive("Preço tem que ser maior que 0"),
 
    image: z.string().nonempty('A image é obrigatória.'),
    languages: z.array(productSchema),
    language: z.array(z.string()),
    ids: z.array(z.number()),
    id: z.number().optional(),

  });
const skipSchema = z.object({
    take: z.number().optional(),
    skip: z.number().optional(),

  });
const deletEditSchema = z.object({
  id: z.number().min(0, 'O id deve ser um número positivo.'),
  languages: z.array(productSchema).optional(),
});

export const productRouter = createTRPCRouter({

  create: publicProcedure
  .input(crateProductSchema)
  .mutation(async ({ ctx, input }) => {
    const validationResult = crateProductSchema.safeParse(input);
    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      throw new Error(JSON.stringify(errors));
    }

    try {
      const createdProduct: Product = await ctx.db.product.create({
        data: {
          price: input.price,
          image: input.image,
        },
      });
      const translationPromises = input.language.map((lang) => {
        return ctx.db.productTranslation.create({
          data: {
            productId: createdProduct.id,
            description: lang.description,
            title: lang.title,
            language: lang.language,

          },
        }) as Promise<ProductTranslation>;
      });

      await Promise.all(translationPromises);

      return {
        data: {
          created: createdProduct,
        },
      };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create product');
    }
  }),
    // getAll: publicProcedure
    // .query(async ({ ctx }) => {
    //     return ctx.db.product.findMany();
    // }),

    getAll: publicProcedure.input(skipSchema).query(async ({ ctx, input }) => {
      const { skip, take } = input || {};
      console.log("skip: ", skip);
      console.log("take: ", take);
    
      const [products, totalCount] = await Promise.all([
        ctx.db.product.findMany({
          skip: skip || 0,
          take: take || 4,
        }),
        ctx.db.product.count(), // Obtém o número total de registros disponíveis
      ]);
    
      const productTranslationsPromises = products.map(async (product) => {
        const translations = await ctx.db.productTranslation.findMany({
          where: { productId: product.id },
        });
    
        return { result: product, translations };
      });
    
      const productTranslations = await Promise.all(productTranslationsPromises);
    
      return {
        products: {
          take,
          skip,
          info: {
            count: totalCount,
          },
          results: productTranslations.map((item) => ({
            result: item.result,
            translations: item.translations,
          })),
        },
      };
    }),
    editId: publicProcedure
    .input(productSchema)
    .mutation(async ({ ctx, input }) => {
        const { id, ...updateData } = input;
        return ctx.db.product.update({
            where: { id },
            data: updateData,
        });
    }),
    editLanguageId: publicProcedure
    .input(editProductSchema)
    .mutation(async ({ ctx, input }) => {
        const {ids, id, language} = input;
        const deleteId = input.ids.map((idMap) => {
          return ctx.db.productTranslation.delete({
            where: { id: idMap },
            }) as Promise<ProductTranslation>
        }) 

        Promise.all(deleteId)
     
        const translationPromises = input.languages.map((lang) => {
          return ctx.db.productTranslation.create({
            data: {
              productId: id,
              description: lang.description,
              title: lang.title,
              language: lang.language,
  
            },
          }) as Promise<ProductTranslation>;
        });
  
        await Promise.all(translationPromises);
        return translationPromises

    }),
    deletId: publicProcedure
    .input(deletEditSchema)
    .mutation(async ({ ctx, input }) => {
        const { id, languages } = input;
        const deleteId = input.languages.map((idMap) => {
          return ctx.db.productTranslation.delete({
            where: { id: idMap.id },
            }) as Promise<ProductTranslation>
        }) 
        await Promise.all(deleteId);

        return ctx.db.product.delete({
        where: { id },
        });
    }),
    getProductId:  publicProcedure.input(deletEditSchema).query(async ({ ctx, input }) => {
      const { id } = input
    
      const [products] = await Promise.all([
        ctx.db.product.findMany({
          where: { id },
        }),
      ]);
    
      const productTranslationsPromises = products.map(async (product) => {
        const translations = await ctx.db.productTranslation.findMany({
          where: { productId: product.id },
        });
    
        return { result: product, translations };
      });
    
      const productTranslations = await Promise.all(productTranslationsPromises);
    
      return {
        products: {
          results: productTranslations.map((item) => ({
            result: item.result,
            translations: item.translations,
          })),
        },
      };
    }),
});
