import React from "react";
import "./itemDetail.scss"


export const ItemDetail = ({ producto }) => {

    return (
        <div>

            <div className="greetingContainer">
                <div className="greetingImg"> <img src="../img/motor 8.jpg" alt="motor" />   </div>

            </div>

            <div className="itemDetailContainer">

                <div className="itemDetailImage">
                    <img src={producto.image} alt={producto.name} />
                </div>

                <div className="itemDetail">

                    <div className="itemTitle">
                        <h3>  {producto.name} </h3>
                        <h4> {producto.subtitle}</h4>
                    </div>

                    <div className="itemDetailDescription">
                        <p className="itemDescriptionTitle"> DESCRIPCIÓN DEL PRODUCTO</p>
                        <p className="itemDescription">  {producto.description} </p>

                    </div>

                    <div className="itemBenefits">
                        <h3> Beneficios: </h3>
                        <ul>
                            {producto.benefits.map((benefit, index) => (
                                <li key={index}>{benefit}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="instructionsOfUse">

                <h3> Modo de uso</h3>

                {producto.instructions.map((instruction, index) => (
                    <div key={index} className="instruction"> 
                     <p> {instruction} </p>
                    </div>
                ))}

            </div>

        </div>


    )
}
