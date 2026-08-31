import React from "react";
import "./product.scss";
import { NavLink } from "react-router-dom";

export const Product = ({ product }) => {
    return (
        <div className="productCardContainer">
            <NavLink to={`/item/${product.id}`} className= "productCard">
                <div>
                    <img src={product.image} alt={product.name}/>
                    <h3> {product.class}</h3>
                    <h2> {product.name}</h2>
                   
                </div>
            </NavLink>

        </div>
    )
}
