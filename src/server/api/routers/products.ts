import { title } from "process";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


const productSchema = z.object({
    title: z.string().nonempty('O título é obrigatório.'),
    description: z.string().nonempty('A descrição é obrigatória.'),
    price:  z.number({
      required_error: "Preço obrigatório",
      invalid_type_error: "Preço obrigatório",
    }).positive("Preço tem que ser maior que 0"),
    take: z.number().optional(),
    skip: z.number().optional(),
    id: z.number().optional(),
    image: z.string().nonempty('A image é obrigatória.'),

  });
const skipSchema = z.object({
    take: z.number().optional(),
    skip: z.number().optional(),

  });
const deletEditSchema = z.object({
  id: z.number().min(0, 'O id deve ser um número positivo.'),
  });

export const productRouter = createTRPCRouter({

    create: publicProcedure
    .input(productSchema)
    .mutation(async ({ ctx, input }) => {
      const validationResult = productSchema.safeParse(input);
      if (!validationResult.success) {
        const errors = validationResult.error.flatten().fieldErrors;
        throw new Error(JSON.stringify(errors));
      }
  
      return ctx.db.product.create({
        data: {
          title: input.title,
          description: input.description,
          price: input.price,
          image: input.image,
        },
      });
    }),
    // getAll: publicProcedure
    // .query(async ({ ctx }) => {
    //     return ctx.db.product.findMany();
    // }),

    getAll: publicProcedure.input(skipSchema).
    query(async ({ ctx, input }) => {
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
    
      return {
        products: {
          take,
          skip,
          info: {
            count: totalCount,
          },
          results: products.map((product) => ({ result: product })),
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
    deletId: publicProcedure
    .input(deletEditSchema)
    .mutation(async ({ ctx, input }) => {
        const { id } = input;
        return ctx.db.product.delete({
        where: { id },
        });
    }),
});
