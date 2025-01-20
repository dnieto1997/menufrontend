import { Link } from "react-router-dom";
import { useLoader } from '../../context/PreloadContext';
import { Variables } from "../../config/Variables";
import { postHttps } from "../../services/https";

export const Facturar = () => {

    const { showLoader, hideLoader } = useLoader();


    const crearFactura = async () => {
       showLoader();
       try {
        const response = await postHttps('prefactura');
        console.log(response.data);
        hideLoader();
    } catch (error) {
        hideLoader();
        setError(`Error ${error.response?.data?.message}`);
    }

    }


    return(
        <>
              <main>
                <div className="container-fluid px-4">
                    <h1 className="mt-4">PreFacturas</h1>
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item"><Link to="/home/dashboard">Dashboard</Link></li>
                        <li className="breadcrumb-item active">Prefacturas</li>
                    </ol>
                    <div className="card mb-4">
                        <div className="card-body"> 
                            
                            <button className={`btn btn-${Variables().classBtn}`} onClick={crearFactura}>Crear Categoria</button> 
                            <hr />
                            <div className="table-responsive">
                              
                            </div>
                        </div>
                    </div>
                    
                </div>
            </main>
        </>
    );
}