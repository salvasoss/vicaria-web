import React from "react";
import { ItemIndex } from "../itemIndex/ItemIndex";
import "./itemListIndex.scss";


export const ItemListIndex = ({products}) => {
    return (
        <div className="itemListContainer">
            {products.map ((product) => <ItemIndex key = {product.id} product = {product}/> )}
        </div>
    )
}
