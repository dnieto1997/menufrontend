import { Link } from "react-router-dom";
import { Variables } from "../config/Variables"
import { useLogIn} from '../context/logInContext';
import React from "react";


export const NavLateral = () => {
    
    const { isName, isType } = useLogIn();

    const menuItems = [
        {
          id: "dashboard",
          heading: "Core",
          title: "Dashboard",
          icon: "fa-tachometer-alt",
          to: "/home/dashboard",
          roles: ["USER", "MASTER", "ADMIN"], // Visible para todos
        },
        {
          id: "configuracion",
          title: "Configuración",
          icon: "fa-columns",
          roles: ["ADMIN","MASTER"], // Solo ADMIN
          submenus: [
            { title: "Usuarios", to: "/home/users" },
            { title: "Empresas", to: "/home/empresas" },
            { title: "Sucursales", to: "/home/sucursales" },
            { title: "Categorias", to: "/home/categorias" },
            { title: "Variantes", to: "/home/variante" },
            { title: "Grupo de Variante", to: "/home/variantegrupo" },
            { title: "Productos", to: "/home/productos" },
          ],
        },
      ];
      
   

    return(
        <>
        <div id="layoutSidenav_nav">
          <nav
            className="sb-sidenav accordion sb-sidenav-dark"
            id="sidenavAccordion"
            style={{ backgroundColor: Variables().color }}
          >
            <div className="sb-sidenav-menu">
              <div className="nav">
                {menuItems
                  .filter((item) => item.roles.includes(isType)) // Filtrar por roles
                  .map((item) => (
                    <React.Fragment key={item.id}>
                      {item.heading && <div className="sb-sidenav-menu-heading">{item.heading}</div>}
                      
                      {item.showTitleOnly ? ( 
                        // Mostrar solo el título sin submenús
                        <a className="nav-link disabled" href="#">
                          <div className="sb-nav-link-icon">
                            <i className={`fas ${item.icon}`}></i>
                          </div>
                          {item.title}
                        </a>
                      ) : item.submenus ? (
                        // Mostrar título con submenús
                        <>
                          <a
                            className="nav-link collapsed"
                            href="#"
                            data-bs-toggle="collapse"
                            data-bs-target={`#${item.id}`}
                            aria-expanded="false"
                            aria-controls={item.id}
                          >
                            <div className="sb-nav-link-icon">
                              <i className={`fas ${item.icon}`}></i>
                            </div>
                            {item.title}
                            <div className="sb-sidenav-collapse-arrow">
                              <i className="fas fa-angle-down"></i>
                            </div>
                          </a>
                          <div
                            className="collapse"
                            id={item.id}
                            aria-labelledby="headingOne"
                            data-bs-parent="#sidenavAccordion"
                          >
                            <nav className="sb-sidenav-menu-nested nav">
                              {item.submenus.map((submenu) => (
                                <Link className="nav-link" to={submenu.to} key={submenu.to}>
                                  {submenu.title}
                                </Link>
                              ))}
                            </nav>
                          </div>
                        </>
                      ) : (
                        // Mostrar título como enlace directo
                        <Link className="nav-link" to={item.to}>
                          <div className="sb-nav-link-icon">
                            <i className={`fas ${item.icon}`}></i>
                          </div>
                          {item.title}
                        </Link>
                      )}
                    </React.Fragment>
                  ))}
              </div>
            </div>
            <div
              className="sb-sidenav-footer"
              style={{ backgroundColor: Variables().color }}
            >
              <div className="small">{isName}</div>
              {isType}
            </div>
          </nav>
        </div>
      </>
      

    )
}