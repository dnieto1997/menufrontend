import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Variables } from '../config/Variables';
import { deleteData, deleteDatabase } from '../database/dbInterna';

export const NavBar = () => {
    const [isSidebarToggled, setIsSidebarToggled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Verificamos si hay algún estado previo en localStorage
        const sidebarState = localStorage.getItem('sb|sidebar-toggle') === 'true';
        setIsSidebarToggled(sidebarState);

        // Aplicamos la clase de la barra lateral al body si es necesario
        if (sidebarState) {
            document.body.classList.add('sb-sidenav-toggled');
        } else {
            document.body.classList.remove('sb-sidenav-toggled');
        }
    }, []);

    const handleToggle = () => {
        // Alternar el estado de la barra lateral
        const newState = !isSidebarToggled;
        setIsSidebarToggled(newState);

        // Aplicar o quitar la clase de la barra lateral
        if (newState) {
            document.body.classList.add('sb-sidenav-toggled');
        } else {
            document.body.classList.remove('sb-sidenav-toggled');
        }

        // Guardar el estado en localStorage
        localStorage.setItem('sb|sidebar-toggle', newState);
    };

    const handleLogout = async () => {

      localStorage.removeItem('authToken');

      await deleteData(1).then(console.log).catch(console.error);
      await deleteDatabase('miBaseDeDatos').then(console.log).catch(console.error);

      navigate('/login');
    };

    return(
        <>
            <nav className="sb-topnav navbar navbar-expand navbar-dark " style={{ backgroundColor: Variables().color }} >
                <a className="navbar-brand ps-3" href="#">
                    <img src={Variables().logo} alt={Variables().empresa}  style={{ width: '100px' }} />
                </a>
                <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#!"  onClick={handleToggle}><i className="fas fa-bars"></i></button>  
                <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
                    <div className="input-group">
                        <input className="form-control" type="text" placeholder="Search for..." aria-label="Search for..." aria-describedby="btnNavbarSearch" />
                        <button className="btn btn-primary" id="btnNavbarSearch" type="button"><i className="fas fa-search"></i></button>
                    </div>
                </form>
                <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i className="fas fa-user fa-fw"></i></a>
                        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                            <li><a className="dropdown-item" href="#!">Settings</a></li>
                            <li><a className="dropdown-item" href="#!">Activity Log</a></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><a className="dropdown-item" onClick={handleLogout}>Logout</a></li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </>
    );
}