'use client'

import { FormEvent, useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { api } from "~/utils/api";
import { FaEdit, FaTrash } from 'react-icons/fa';
import {  CiSaveDown2 } from 'react-icons/ci';
import {  AiOutlineClose } from 'react-icons/ai';
import { ProductsI } from '~/interfaces/productsI';



export default function ProductsItems({ title, description, price, id, image}: ProductsI) {
  const edit = api.products.editId.useMutation({});
  const deleteId = api.products.deletId.useMutation({});
  
  const [editBoolean, setEditBoolean] = useState(false)

  const  handleSave = (data: ProductsI) => {
    console.log("data", data)
    edit.mutate({
      id: id,
      title: data.title,
      description: data.description,
      price: Number(data.price),
      image: data.image
    }, {
      onSuccess: () => {
        setEditBoolean(!editBoolean);
        window.location.reload();
      },
    });
  }
  const handleDelete = () => {
    console.log("data", id)
    deleteId.mutate({id}, 
      {
        onSuccess: () => {
          window.location.reload();
        },
      });
  }

  useEffect(() => {
    setEditBoolean(true)
  },[])

  const { control, handleSubmit, register } = useForm({
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      image: '',
    }
  });
  
  return (
    <form onSubmit={handleSubmit(handleSave)}>  
      <div className="flex h-28 shadow-lg bg-white rounded-lg">
        <div className="w-48 bg-transparent00 h-full">
        {editBoolean ? (
          <img className="h-full rounded-s-lg rounded-ss-lg object-center pr-4" src={image} alt="Descrição da imagem" />
          ) : (
            <input {...register("image")} placeholder='Nova imagem' />
          )}
        </div>
        <div className="flex-1 justify-between flex flex-col">
          <div className="flex justify-between items-center">
            {editBoolean ? (
              <div className="text-1xl flex-nowrap font-bold uppercase">{title}</div>
            ) : (
              <input {...register("title")} placeholder='Novo Título' />
            )}
            {editBoolean ? (
              <div className="flex items-center space-x-2 m-1">
                <FaEdit  onClick={() => setEditBoolean(!editBoolean)}  />
                <FaTrash onClick={() => handleDelete()} className="cursor-pointer text-red-700" />
              </div>
            ) : (
              <div className="flex items-center space-x-2 m-1">
                <button type='submit'>

              <CiSaveDown2 className="cursor-pointer text-gray-700" type='submit'/>
                </button>
              <AiOutlineClose className="cursor-pointer text-red-700" onClick={() => setEditBoolean(!editBoolean)}/>
              </div>
            )}
          </div>
          {editBoolean ? (
            <div className="text-xs flex-wrap font-normal mr-3">{description}</div>
          ) : (
            <input {...register("description")} placeholder='Nova Descrição' />
          )}
          {editBoolean ? (
            <div className="text-1xl flex-wrap font-bold mb-2">R${price}</div>
          ) : (
            <input {...register("price")} placeholder='Novo Preço' />
          )}
        </div>
      </div>
    </form>
  )
}



