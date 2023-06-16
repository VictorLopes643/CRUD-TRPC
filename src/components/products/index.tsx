'use client'

import { FormEvent, useState, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { api } from "~/utils/api";
import { FaEdit, FaTrash } from 'react-icons/fa';
import {  CiSaveDown2 } from 'react-icons/ci';
import {  AiOutlineClose } from 'react-icons/ai';
import { ProductsI } from '~/interfaces/productsI';
import { Router, useRouter } from "next/router";



export default function ProductsItems({ title, description, price, id, image, language}: ProductsI) {
  const edit = api.products.editId.useMutation({});
  const deleteId = api.products.deletId.useMutation({});
  
  const [editBoolean, setEditBoolean] = useState(false)

  const router = useRouter();

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
    deleteId.mutate({id, languages: language}, 
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
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedLanguageI, setSelectedLanguageI] = useState(0);
  console.log("selectedLanguage", selectedLanguage)
  console.log("selectedLanguageI", selectedLanguageI)
  const handleLanguageChange = (event) => {
    setSelectedLanguageI(event.target.selectedIndex);
    setSelectedLanguage(event.target.value);
  };
  
  return (
    <form onSubmit={handleSubmit(handleSave)}>  
      <div className="flex h-28 shadow-lg bg-white rounded-lg">
        <div className="w-48 bg-transparent00 h-full">
          <img className="h-full rounded-s-lg rounded-ss-lg object-center pr-4" src={image} alt="Descrição da imagem" />
        </div>
        <div className="flex-1 justify-between flex flex-col">
          <div className="flex justify-between items-center">
              <div className="text-1xl flex-nowrap font-bold uppercase">{language[selectedLanguageI]?.title}</div>          
              <div className="flex items-center space-x-2 m-1">
                <FaEdit  onClick={() => router.push(`/edit/${id}`)} />
                <FaTrash onClick={() => handleDelete()} className="cursor-pointer text-red-700" />
              </div>
             
          </div>
       
            <div className="text-xs flex-wrap font-normal mr-3">{language[selectedLanguageI]?.description}</div>
      
       
            <div className='flex justify-between mr-2 mb-2 items-end'>
              <div className="text-1xl flex-wrap font-bold mb-2">R${price}</div>
              <div className="flex items-center">
                <label htmlFor="language" className="mr-2">
                </label>
                <select
                  id="language"
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {language.map((language) => (
                    <option key={language.id} value={language.language}>
                      {language.language}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            
      
          
        </div>
      </div>
    </form>
  )
}



