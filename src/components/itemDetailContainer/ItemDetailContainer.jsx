import React from "react"
import { useState, useEffect } from "react"
import { ItemDetail } from "../itemDetail/ItemDetail"
import { getProducts, getOneProduct } from "../../mock/vicariaProducts"
import { useParams } from "react-router-dom"
import { Spinner } from "react-bootstrap"



 const ItemDetailContainer = () => {
        const {itemId} = useParams()
    const [loading, setLoading] = useState (false)
      const [producto, setProducto] = useState (null) 

     useEffect (() => {
        setLoading(true)
         getOneProduct (itemId)
         .then((res) => setProducto(res))
         .catch ((error) => console.log(error))
         .finally (() => setLoading(false))
         
     }, [])

     if (loading) {
        <Spinner animation="border"/>
    }

    return (
        <div>
        {producto ? (
            <ItemDetail producto={producto} />
            
        ) : (
            loading ? (
                <Spinner animation="border" />
            ) : (
                <p>No se encontró el producto.</p>
            )
        )}

        
        
    </div>
    )
}

export default ItemDetailContainer
