'use client'
import { NextPage } from "next"
import { Router, useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { ProductsI, ProductsLanguages } from "~/interfaces/productsI";
import { api } from "~/utils/api";



const New: NextPage = () => {
    const created = api.products.create.useMutation({});
    const router = useRouter();
    const onSubmit: SubmitHandler<ProductsLanguages> = async (data) => {
      console.log("data", data);
      try {
        await created.mutateAsync({
          price: Number(data.price),
          image: data.image,
          language: data.languages
        });
        void router.push('/');
      } catch (error) {
        console.error(error);
      }
    };
    console.log('created--'  , created )

    const {  handleSubmit, register, control } = useForm({
      defaultValues: {
        languages: [],
        price: 0,
        image: ''
      }
    });

    
    const { fields, append, remove } = useFieldArray({
      control,
      name: 'languages',
    });
  


    return (
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-3">
        <input
            className="border border-gray-300 rounded-md p-2 mb-2"
            {...register("price")}
            placeholder="Preço"
            type="number"
          />
          <input
            className="border border-gray-300 rounded-md p-2 mb-2"
            {...register("image")}
            placeholder="URL da imagem"
            type="text"
          />
      {fields.map((item, index) => (
        <div key={item.id}>
          <input
            className="border border-gray-300 rounded-md p-2 mb-2"
            {...register(`languages[${index}].language`)}
            placeholder="Idioma"
            type="text"
          />
          <input
            className="border border-gray-300 rounded-md p-2 mb-2"
            {...register(`languages[${index}].title`)}
            placeholder="Título"
            type="text"
          />
          <input
            className="border border-gray-300 rounded-md p-2 mb-2"
            {...register(`languages[${index}].description`)}
            placeholder="Descrição"
            type="text"
          />
       

          <button
            className="bg-red-500 text-white rounded-md py-2 px-4"
            type="button"
            onClick={() => remove(index)}
          >
            Remover idioma
          </button>
        </div>
      ))}

      <button
        className="bg-blue-500 text-white rounded-md py-2 px-4"
        type="button"
        onClick={() => append({ language: '', title: '', description: '' })}
      >
        Adicionar idioma
      </button>

      <button className="bg-blue-500 text-white rounded-md py-2 px-4" type="submit">
        Salvar
      </button>
    </form>
    )
}

export default New