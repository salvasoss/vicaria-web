import React from "react";
import "./productsListContainer.scss";
import { useState, useEffect } from "react";
import { getProducts } from "../../mock/vicariaProducts";
import {ProductsList} from "../productsList/ProductsList";
import { useParams } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';


export const ProductListContainer = () => {
    const [products, setProducts] = useState ([])
    const [loading, setLoading] = useState (false)
    const {categoryId} = useParams ()
    

    
    useEffect (() => {
        setLoading(true)
        getProducts ()
        .then ((res) =>{
            if (categoryId){
                setProducts(res.filter ((products) => products.category === categoryId))
            }else {
                setProducts(res)
            }
        })
        .catch ((error) => console.log(error, "Error"))
        .finally (() => setLoading(false))
    }, [categoryId]) //array de dependencias: solo se ejecuta la promesa cuando aparezca categoryID
    
    
    if (loading) {
        return <Spinner animation="border"/>;
    }

    return (
        <div>
            
            
           
            <ProductsList products = {products}/> 

        </div>
    )
}