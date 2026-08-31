import React from "react";
import "./greeting.scss";
import { useParams } from "react-router-dom";
import { ProductListContainer } from "../productsListContainer/ProductsListContainer";
export const Greeting = () => {
    const { pageURL } = useParams();
    let title;
    let subtitle;
    let content;

    switch (pageURL) {
        case "Productos":
            title = "PRODUCTOS";
            subtitle = "Con mas de 70 años de trayectoria a nivel Internacional, Vicaria ofrece productos de alta calidad a un precio accesible para mayoristas como minoristas ";
            content = <ProductListContainer />
            break;

        case "Contacto":
            title = "CONTACTO";
            subtitle = "Contactanos por nuestras diversas redes sociales y de contacto!";

            break;

        case "Acerca de Vicaria":
            title = "VICARIA";
            subtitle = "Vicaria es una marca familiar creada en 1954, recorriendo todo el pais y ganando renombre ;tanto en Argentina como en sus paises Limitrofes"
            break;

        case "Canales de Venta":
            title = "VENTA";
            subtitle = "Podes conseguir nuestros productos en Facebook Marketplace tanto como en Mercado Libre!";
            break;

        default:
            title = "Pagina no encontrada";
            break;
    }
    return (
        <div >
            <div className="greetingContainer">
                <div className="greetingImg"> <img src="./img/motor 8.jpg" alt="motor" />   </div>
                <div className="greetingText">
                    <h3> {title} </h3>
                    <h4> {subtitle} </h4>
                </div>

            </div>

            {content}
        </div>
    )
}