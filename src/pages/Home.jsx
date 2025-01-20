import { useEffect } from 'react';
import { NavBar } from '../components/NavBar';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { NavLateral } from '../components/NavLateral';
import { Footer } from '../components/Footer';
import { DashBoard } from './home/DashBoard';
import { Forbidden } from './home/Forbidden';
import { NotFound } from './home/NotFound';
import { Users } from './home/Users';
import { Sucursales } from './home/Sucursales';
import { setupAxiosInterceptors } from '../services/interceptorAxios';
import { LogInProvider } from '../context/logInContext';
import { Categorias } from './home/Categorias';
import { Articulos } from './home/Articulos';
import { FormaPago } from './home/FormaPagos';
import { Terceros } from './home/Terceros';
import { Turnos } from './home/Turnos';
import { Facturar } from './home/Facturar';
import { Empresas } from './home/Empresas';
import { Productos } from './home/Productos';
import { Variante } from './home/Variante';
import { VarianteGrupo } from './home/Variante_grupo';

export const Home = () => {
   
    const navigate = useNavigate();


    // Usa useEffect para configurar el interceptor solo una vez al cargar el componente
    useEffect(() => {
        setupAxiosInterceptors(navigate);
    }, [navigate]); // Solo se ejecuta una vez cuando se monta el componente

    return (
        <>
            <LogInProvider>

                <NavBar />
                <div id="layoutSidenav">
                    <NavLateral />
                    <div id="layoutSidenav_content">
                        <Routes>
                            {/* Redirección por defecto de /home a /home/dashboard */}
                            <Route path="" element={<Navigate to="dashboard" replace />} />

                            {/* Subrutas */}
                            <Route path="dashboard" element={<DashBoard />} />
                            <Route path="users" element={<Users />} />
                            <Route path="empresas" element={<Empresas />} />
                            <Route path="categorias" element={<Categorias />} />
                            <Route path="sucursales" element={<Sucursales />} />
                            <Route path="articulos" element={<Articulos />} />
                            <Route path="formapago" element={<FormaPago />} />
                            <Route path="terceros" element={<Terceros />} />
                            <Route path="turnos" element={<Turnos />} />
                            <Route path="facturar" element={<Facturar />} />
                            <Route path="productos" element={<Productos />} />
                            <Route path="variante" element={<Variante />} />
                            <Route path="variantegrupo" element={<VarianteGrupo />} />
                            <Route path="forbidden" element={<Forbidden />} />
                            
                            {/* Ruta comodín para manejar el 404 */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                        <Footer />
                    </div> 
                </div> 
                
            </LogInProvider>
        </>
    );
}