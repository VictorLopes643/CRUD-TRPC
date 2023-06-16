'use client'
 
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '~/utils/api';
 
export default function SearchBar() {
  const searchParams = useSearchParams()
  const router = useRouter();

  const idParms = searchParams.get('id')
  const getProduct =  api.products.getProductId.useQuery({id:Number(idParms)});
  const editProduct = api.products.editLanguageId.useMutation({})
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    const { languages, ...rest } = data;
  
    console.log('onSubmit', languages);
    editProduct.mutate({
      languages: languages,
      image: getProduct.data?.products.results[0]?.result.image,
      price: getProduct.data?.products.results[0]?.result.price,
      language: getProduct.data?.products.results[0]?.translations.map((language) => language.language),
      ids: getProduct.data?.products.results[0]?.translations.map((id) => id.id),
      id: getProduct.data?.products.results[0]?.result.id
    }, {
      onSuccess: () => {
        router.push('/')
      },
    });
  }
  const [product, setProduct] = useState()
  useEffect(() => {
    setProduct(getProduct?.data?.products?.results[0])
  },[getProduct])

  console.log("product", product)
  console.log("getProduct", getProduct.data)
  // URL -> `/dashboard?search=my-project`
  // `search` -> 'my-project'
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
  {product?.translations.map((result, index) => (
    <div key={index} className="mb-4">
      <div className="mb-2">
        <label htmlFor={`language-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Language:</label>
        <input
          type="text"
          id={`language-${index}`}
          {...register(`languages[${index}].language`)}
          defaultValue={result.language}
          className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        />
      </div>
      <div className="mb-2">
        <label htmlFor={`title-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Title:</label>
        <input
          type="text"
          id={`title-${index}`}
          {...register(`languages[${index}].title`)}
          defaultValue={result.title}
          className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        />
      </div>
      <div className="mb-2">
        <label htmlFor={`description-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Description:</label>
        <input
          type="text"
          id={`description-${index}`}
          {...register(`languages[${index}].description`)}
          defaultValue={result.description}
          className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        />
      </div>
    </div>
  ))}
  <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
    Submit
  </button>
</form>
  )
}