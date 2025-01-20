import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteHttps, getHttps, pachHttps, postHttps } from "../../services/https";
import { alertConfirmacion } from "../../services/alerta";
import { Variables } from "../../config/Variables"
import { useLoader } from '../../context/PreloadContext';
import Swal from "sweetalert2";
import { formatDate } from "../../services/formatoFecha";
import { formatarValorMonetario } from "../../services/formatoMoneda";

export const Turnos = () =>{

    const [varApertura, setVarApertura] = useState([]);
    const [varSucursales, setVarSucursales] = useState([]);
    const { showLoader, hideLoader } = useLoader();

    const [id, setId] = useState(0);
    const [base, setBase] = useState('');
    const [bodega, setBodega] = useState('');
    const [selectedSucursales, setSelectedSucursales] = useState([]);

    const viewAll = async () => {
        showLoader();
        try {
            const response = await getHttps('turnos');
            setVarApertura(response.data);
            hideLoader();
        } catch (error) {
            hideLoader();
            setError(`Error ${error.response?.data?.message}`);
        }
    }

    const sucursalAll = async () => {
        try {
            const response = await getHttps('sucursales');
            setVarSucursales(response.data);
        } catch (error) {
            setError(`Error ${error.response?.data?.message}`);
        }
    }

    const abrirModal = () => {

        setId('0')
        setBase('');
        setBodega('');
        setSelectedSucursales([])
        $('#exampleModal').modal('show');
    }

    const onSubmit = async (event) => {
        event.preventDefault();
      
        try {
            showLoader();
            if(id==0){
                const response = await postHttps('turnos',{base,bodega});
            }else{
                const response = await pachHttps('turnos/'+id,{ base,bodega});
            }

            hideLoader();
            $("#exampleModal").modal('hide');
            viewAll();
           
        } catch (error) {
            hideLoader();
            Swal.fire(
                'Error de validacion',
                `${error.response?.data?.message}`,
                'error'
            );
        }
    };

    const abrirModalEdit = (data) => {
       alert(`Imprimir...   `)
    }

    const deleteItem = async (id,turno) => {
        try {
            const mensaje = await alertConfirmacion(`¿Estás seguro de terminar el turno ${turno}?`);
            showLoader();
            const response = await pachHttps('turnos/'+id, {status:false}); 
            hideLoader();
            await viewAll(); 
          } catch (error) {
            hideLoader();
           /*  console.log(error);  */
          }
    }

    useEffect(() => {
        viewAll();
        sucursalAll();
    }, []);

    useEffect(() => {
        if (varApertura.length > 0) {

            // Inicializar DataTable solo cuando los usuarios estén cargados
            const tableElement = document.getElementById('myTable');

            if ($.fn.DataTable.isDataTable(tableElement)) {
                $(tableElement).DataTable().destroy();
            }
            
            if (tableElement) {
                new DataTable('#myTable',{
                    "order": [[ 0, "desc" ]],
                    "rowCallback": function(row, data) {
                        if (data[7] == "CERRADO" ) {
                            // Agregar la clase 'table-danger' si status es false
                            row.classList.add('table-danger');
                        } else {
                            // Asegurarse de que la clase no esté presente si status es true
                            row.classList.remove('table-danger');
                        }

                        if (data[7] == "ABIERTO" ) {
                            // Agregar la clase 'table-danger' si status es false
                            row.classList.add('table-success');
                        } else {
                            // Asegurarse de que la clase no esté presente si status es true
                            row.classList.remove('table-succes');
                        }
                    },
                });
            }

            /* return () => {
                tableElement.destroy();
            } */
        }
    }, [varApertura]); // Se ejecuta cuando varUsers cambie


    return(
        <>
             <main>
                <div className="container-fluid px-4">
                    <h1 className="mt-4">Tunos</h1>
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item"><Link to="/home/dashboard">Dashboard</Link></li>
                        <li className="breadcrumb-item active">Turnos</li>
                    </ol>
                    <div className="card mb-4">
                        <div className="card-body"> 
                            
                            <button className={`btn btn-${Variables().classBtn}`} onClick={abrirModal}>Crear Turno</button>
                            <hr />
                            <div className="table-responsive">
                                <table className="table table-bordered" id="myTable">
                                    <thead className={`table-${Variables().classTable}`}>
                                        <tr >
                                            <th scope="col">ID</th>
                                            <th scope="col">SUCURSAL</th>
                                            <th scope="col">TURNO</th>
                                            <th scope="col">BASE</th>
                                            <th scope="col">USUARIO</th>
                                            <th scope="col">APERTURA</th>
                                            <th scope="col">CIERRE</th>
                                            <th scope="col">ESTADO</th>
                                            <th scope="col">ACCION</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {varApertura.length > 0 ? (
                                            varApertura.map((user, index) => (
                                                <tr key={index}>
                                                    <th>{user.id}</th>
                                                    <td>{user.nomSucursal}</td>
                                                    <td>{user.turno}</td>
                                                    <td>{formatarValorMonetario(user.base)}</td>
                                                    <td>{user.nomUser}</td>
                                                    <td>{formatDate( user.apertura )}</td>
                                                    <td>{formatDate( user.cierre )}</td>
                                                    <td>
                                                        {user.status ? (
                                                           'ABIERTO'
                                                        ) : (
                                                           'CERRADO'
                                                        )}
                                                    </td>
                                                    <td>
                                                        <button 
                                                            type="button" 
                                                            className="btn btn-primary" 
                                                            onClick={
                                                                () =>  abrirModalEdit(
                                                                    user
                                                                )
                                                            }>
                                                            <i className="fas fa-file-signature"></i>
                                                        </button> 
                                                        &nbsp;
                                                        {user.status ? (
                                                            <button 
                                                                type="button" 
                                                                className="btn btn-danger" 
                                                                onClick={() => deleteItem(user.id, user.turno)}
                                                            >
                                                                <i className="far fa-edit"></i>
                                                            </button>
                                                        ) : null}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center">Cargando turnos...</td>
                                            </tr>
                                        )}
                                    </tbody> 
                                </table>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </main>

            <div className="modal" data-bs-backdrop="static" tabIndex="-1" id="exampleModal">
                <div className="modal-dialog modal-xl modal-dialog-scrollable">
                    <div className="modal-content">
                        
                    <div className={`modal-header btn btn-${Variables().classHeader}`}>
                        <h5 className="modal-title">Articulo</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={onSubmit}>
                           
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input 
                                            type="hidden" 
                                            value={id} 
                                            onChange={(e) => setId(e.target.value)}  />
                                        <input 
                                            className="form-control" 
                                            type="number" 
                                            value={base} 
                                            onChange={(e) => setBase(e.target.value)} 
                                            placeholder="Ingrese Codigo" 
                                            />
                                        <label htmlFor="inputEmail">Digite la base</label>
                                    </div>
                                </div>
                                 <div className="col-md-6">
                                    
                                    <div className="form-floating mb-3">
                                        <select 
                                                className="form-control" 
                                                type="text" 
                                                value={bodega} 
                                                onChange={(e) => setBodega(e.target.value)} 
                                            >
                                                <option value="">Seleccione una sucursal</option> 
                                                { varSucursales.map((sucursal, index) => ( 
                                                    <option key={sucursal.id} value={sucursal.id}>
                                                        {sucursal.name}
                                                    </option>
                                                ) )}
                                            
                                        </select>
                                        <label htmlFor="inputEmail">Seleccione sucursales</label>
                                    </div>
                                </div> 
                            </div>

                            <div className="d-flex align-items-center justify-content-between mt-4 mb-0">
                                <a className="small">&nbsp;</a>
                                <button className="btn btn-primary" type="submit">Guardar</button>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>
        </>
    );
}