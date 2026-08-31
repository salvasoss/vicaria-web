import React from "react";
import { NavBar } from "../navbar/NavBar" 
import "./header.scss";

export const Header = () => {
    return (
        <div className="headerContainer">
            <NavBar/>
        </div>
    )
}