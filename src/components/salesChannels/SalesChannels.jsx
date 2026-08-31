import React from "react";
import "./salesChannels.scss";
import { NavLink } from "react-router-dom"

export const SalesChannels = () => {

    const channels = [
        {
            src: './img/facebook.png',
            alt: 'facebook',
            text: 'Marketplace',
            to: '/facebook',
        },
        {
            src: './img/mercadolibre.png',
            alt: 'mercado libre',
            text: 'Mercado Libre',
            to: '/mercadolibre',
        },
        {
            src: './img/whatsapp.png',
            alt: 'whatsapp',
            text: 'Whatsapp',
            to: '/whatsapp',
        },
    ];


    return (
        <div className="salesChannelsBackground">
            <h3> CANALES DE VENTA </h3>

            {/* <div className="saleChannelsContainer">
                {channels.map((channel, index) => (
                    <div key={index} className="saleChannel">
                            <img src={channel.src} alt={channel.alt} className="saleChannelImage" />
                            <NavLink to={channel.to}> <button className={`saleChannelButton button${index}`}>{channel.text}</button> </NavLink>
                    </div>
                ))}
            </div> */}

            <div className="salesChannelsContainer"> 
                
                <div className="saleChannel">
                    
                         <img src="./img/facebook.png" alt="facebook" /> 
                         <NavLink to=""> <button className="saleChannelButtonFacebook"> Marketplace</button>  </NavLink> 
                  
                </div>
                <div className="saleChannel">
                
                    <img src="./img/mercadolibre.png" alt="mercado libre" />
                    <NavLink to="">  <button className="saleChannelButtonML"> Mercado Libre</button> </NavLink> 
                    
                </div>
                <div className="saleChannel">
                
                     <img src="./img/whatsapp.png" alt="whatsapp" /> 
                     <NavLink to=""> <button className="saleChannelButtonWhatsapp"> Whatsapp </button>
                     </NavLink> 
                </div>
            </div>
        </div>
    )
}