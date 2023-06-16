import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import ProductsItems from "~/components/products";
import { api } from "~/utils/api";
import { faker } from '@faker-js/faker';
import { create } from "domain";
import { useEffect, useState } from "react";

type PageButtonProps = {
  page: number;
  currentPage: number;
  onClick: (page: number) => void;
};





const Home: NextPage = () => {

  const [spik, setSpik] = useState(0)

  const created = api.products.create.useMutation({});

  const itemsPerPage = 4;
  const maxButtons = 7;

  const [currentPage, setCurrentPage] = useState(1);
  const getAll = api.products.getAll.useQuery({ skip: (currentPage - 1) * itemsPerPage, take: itemsPerPage });
  const totalCount = getAll.data? getAll.data.products.info.count: 0;

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const maxButtonsToShow = Math.min(maxButtons, totalPages);

  let startPage = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
  let endPage = startPage + maxButtonsToShow - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxButtonsToShow + 1);
  }

  const handlePageChange = (page:number) => {
    setCurrentPage(page);
  };

  console.log("Get All", getAll.data)

    // created.mutate({title: "Ez Title", description: "Ez Desc", price: 1000})
  interface ProductsI {
    title: string;
    description: string;
    price: number
  }


  const PageButton = ({ page, currentPage, onClick }: PageButtonProps) => {
    const isActive = page === currentPage;
    const buttonClasses = `text-blue-700 font-bold py-2 px-4 rounded hover:bg-blue-600 hover:text-white ${
      isActive ? 'bg-blue-700 text-white' : ''
    }`;
  
  
    return (
      <button onClick={() => onClick(page)} disabled={isActive} className={buttonClasses}>
        {page}
      </button>
    );
  };
  

  return(
    <>
      <div className="flex-1 justify-center space-y-5">
      {getAll.data?.products?.results?.map((product, index) => (
        <ProductsItems
        key={index}
        title={product.result.title}
        description={product.result.description}
        price={product.result.price}
        id={product.result.id}
        image={product.result.image}
        />
        ))}
        </div>
      <div className="flex justify-center  sticky bottom-0">
        {Array.from({ length: maxButtonsToShow }, (_, index) => startPage + index).map((page) => (
          <PageButton key={page} page={page} currentPage={currentPage} onClick={handlePageChange} />
        ))}
      </div>
  </>


  );
  
};


export default Home;
