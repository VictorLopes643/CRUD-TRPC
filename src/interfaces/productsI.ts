
export interface ProductsI {
    title: string;
    description: string;
    price: number;
    id: number;
    image: string;
    language: [ProductsLanguages]
}
export interface ProductsLanguages {
    language: [ProductsI]
}
