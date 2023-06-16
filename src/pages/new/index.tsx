'use client'
import { NextPage } from "next"
import { Router, useRouter } from "next/router";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ProductsI } from "~/interfaces/productsI";
import { api } from "~/utils/api";



const New: NextPage = () => {
    const created = api.products.create.useMutation({});
    const router = useRouter();
    const onSubmit: SubmitHandler<ProductsI> = async (data) => {
      console.log("data", data);
      try {
        await created.mutateAsync({
          title: data.title,
          description: data.description,
          price: Number(data.price),
          image: data.image
        });
        void router.push('/');
      } catch (error) {
        console.error(error);
      }
    };
    console.log('created error'  , created.error )

    const {  handleSubmit, register } = useForm({
      defaultValues: {
        title: '',
        description: '',
        price: 0,
        image: '',
      }
    });
    
    return (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-3 ">
                <input className="border border-gray-300 rounded-md p-2 mb-2" {...register("title")} placeholder="Título" type="text" />                              
                {created.error?.data?.zodError && <p className="text-red-500">{(created.error.data.zodError.fieldErrors.title)}</p>}

                <input className="border border-gray-300 rounded-md p-2 mb-2" {...register("description")} placeholder="Descrição" type="text" />
                {created.error?.data?.zodError && <p className="text-red-500">{(created.error.data.zodError.fieldErrors.description)}</p>}

                <input className="border border-gray-300 rounded-md p-2 mb-2" {...register("price")} placeholder="Preço" type="number" />
                {created.error?.data?.zodError  && <p className="text-red-500">{(created.error.data.zodError.fieldErrors.price)}</p>}
                <input className="border border-gray-300 rounded-md p-2 mb-2" {...register("image")} placeholder="URL da image" type="text" />
                {created.error?.data?.zodError  && <p className="text-red-500">{(created.error.data.zodError.fieldErrors.image)}</p>}
                {created.isLoading?
                <div className="bg-blue-500 text-white rounded-md py-2 px-4">Loading...</div>:
                <button className="bg-blue-500 text-white rounded-md py-2 px-4" type="submit">Salvar</button>
              }
          </form>
    )
}

export default New