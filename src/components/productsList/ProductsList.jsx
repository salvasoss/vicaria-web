import React from "react";
import "./productsList.scss";
import {Product} from "../product/Product";


export const ProductsList = ({products}) => {
    return (
        <div className="productsListContainer">
            {products.map ((product) => <Product key = {product.id} product = {product}/> )}
        </div>
    )
}
