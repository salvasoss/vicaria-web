import "./navbar.scss"
import { NavLink } from "react-router-dom"

export const NavBar = () => {
    return (
        <div>
            <header>

                {/* <nav className="navbar">
                    <ul className="navItems">
                    <li> <img src="../img/LOGO VICARIA PNG.png" alt="logo sella grietas vicaria" className="logo" /></li>
                        <li> <a href="">Productos </a> </li>
                        <li>  <a href=" "> Contacto</a> </li>
                        <li> <a href=" "> Consejos de uso</a> </li>
                        <li>  <a href=" "> Acerca de Vicaria</a>  </li>
                    </ul>
                </nav> */}



                <div className="navbarAnnouncement">
                    <h3> ¡ENVIOS A TODO EL PAIS!</h3>
                </div>

                <nav className="navbar navbar-expand-lg nav">
                    <NavLink className="navbar-brand logo" to= "/">
                        <img src="../img/LOGO VICARIA PNG.png" alt="logo sella grietas vicaria" className="logo" />
                    </NavLink>

                    <button className="navbar-toggler hamburgerMenu" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse ulContainer" id="navbarNav">
                        <ul className="navbar-nav navbarUl">
                            <li className="nav-item active">
                                <NavLink className="nav-link link" to="/Productos"> Productos </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link link " to="/Contacto"> Contacto </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link link" to= "/Acerca de Vicaria"> Acerca de Vicaria </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link link" to= "/Canales de Venta"> Canales de Venta </NavLink>
                            </li>
                        </ul>
                    </div>
                </nav>


            </header>
        </div>
    )
}