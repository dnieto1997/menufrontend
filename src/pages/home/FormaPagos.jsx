import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteHttps, getHttps, pachHttps, postHttps } from "../../services/https";
import { alertConfirmacion } from "../../services/alerta";
import { Variables } from "../../config/Variables"
import { useLoader } from '../../context/PreloadContext';
import Swal from "sweetalert2";

export const FormaPago = () => {

    const [varFormapago, setVarFormapago] = useState([]);

    const { showLoader, hideLoader } = useLoader();

    const [id, setId] = useState(0);
    const [name, setName] = useState('');
    const [efecty, setEfecty] = useState(0);
    const [status, setStatus] = useState(1);

    const viewAll = async () => {
        showLoader();
        try {
            const response = await getHttps('formapago');
            setVarFormapago(response.data);
            hideLoader();
        } catch (error) {
            hideLoader();
            setError(`Error ${error.response?.data?.message}`);
        }
    }

    const abrirModal = () => {
        setId('0')
        setName('');
        setEfecty(0);
        setStatus(1)
        $('#exampleModal').modal('show');
    }

    const abrirModalEdit = (uid,nombre,efectivo,estado) => {
        let numStatus = 1;
        if(!estado){
            numStatus = 0;
        }
        let numEfecty = 1;
        if(!efectivo){
            numEfecty = 0;
        }
        setId(uid)
        setName(nombre);
        setEfecty(numEfecty);
        setStatus(numStatus);
        $('#exampleModal').modal('show');
    }

    const onSubmit = async (event) => {
        event.preventDefault();
      
        let estado = Number(status);
        try {
            showLoader();
            if(id==0){
                const response = await postHttps('formapago',{ name,efecty,status:estado});
            }else{
                const response = await pachHttps('formapago/'+id,{ name,efecty,status:estado});
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

    const deleteItem = async (id) => {
        try {
            const mensaje = await alertConfirmacion('¿Estás seguro de eliminar este registro?');
            showLoader();
            const response = await deleteHttps('formapago', id); 
            hideLoader();
            await viewAll(); 
          } catch (error) {
            hideLoader();
            //console.log(error); 
          }
    }

    useEffect(() => {
        viewAll();
    }, []);

    useEffect(() => {
        if (varFormapago.length > 0) {

            // Inicializar DataTable solo cuando los usuarios estén cargados
            const tableElement = document.getElementById('myTable');
            
            if (tableElement) {
                new DataTable('#myTable');
            }

            /* return () => {
                tableElement.destroy();
            } */
        }
    }, [varFormapago]);

    return(
        <>
            <main>
                <div className="container-fluid px-4">
                    <h1 className="mt-4">Forma de pago</h1>
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item"><Link to="/home/dashboard">Dashboard</Link></li>
                        <li className="breadcrumb-item active">Forma de pago</li>
                    </ol>
                    <div className="card mb-4">
                        <div className="card-body"> 
                            
                            <button className={`btn btn-${Variables().classBtn}`} onClick={abrirModal}>Crear forma de pago</button>
                            <hr />
                            <div className="table-responsive">
                                <table className="table table-bordered" id="myTable">
                                    <thead className={`table-${Variables().classTable}`}>
                                        <tr >
                                            <th scope="col">ID</th>
                                            <th scope="col">NOMBRE</th>
                                            <th scope="col">EFECTY</th>
                                            <th scope="col">ESTADO</th>
                                            <th scope="col">ACCION</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        
                                        {varFormapago.length > 0 ? (
                                            varFormapago.map((user, index) => (
                                                <tr key={index}>
                                                    <th>{user.id}</th>
                                                    <td>{user.name}</td>
                                                    <td>
                                                        {user.efecty ? (
                                                            <span className="badge bg-success">SI</span>
                                                        ) : (
                                                            <span className="badge bg-danger">NO</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {user.status ? (
                                                            <span className="badge bg-success">Activo</span>
                                                        ) : (
                                                            <span className="badge bg-danger">Inactivo</span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <button 
                                                            type="button" 
                                                            className="btn btn-primary" 
                                                            onClick={
                                                                () =>  abrirModalEdit(
                                                                    user.id,
                                                                    user.name,
                                                                    user.efecty,
                                                                    user.status)}>
                                                                        <i className="far fa-edit"></i>
                                                        </button> 
                                                        &nbsp;
                                                        <button type="button" className="btn btn-danger" onClick={() =>  deleteItem(user.id)}><i className="fas fa-trash"></i></button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center">Cargando forma de pago...</td>
                                            </tr>
                                        )}

                                    </tbody> 
                                </table>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </main>

            <div className="modal"  data-bs-backdrop="static" tabIndex="-1" id="exampleModal">
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                    <div className={`modal-header btn btn-${Variables().classHeader}`}>
                        <h5 className="modal-title">Forma de pago</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={onSubmit}>
                            <div className="form-floating mb-3">
                                <input 
                                    type="hidden" 
                                    value={id} 
                                    onChange={(e) => setId(e.target.value)}  />
                                <input 
                                    className="form-control" 
                                    id="inputEmail" 
                                    type="text" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    placeholder="Ingrese Nombre" 
                                    />
                                <label htmlFor="inputEmail">Nombre</label>
                            </div>
                            <div className="form-floating mb-3">
                                    <select 
                                        className="form-control" 
                                        type="text" 
                                        value={efecty} 
                                        onChange={(e) => setEfecty(e.target.value)} 
                                    >
                                        <option value="">Seleccione efectivo</option> 
                                        <option value="0">No</option>
                                        <option value="1">Si</option>
                                    </select>
                                <label htmlFor="inputEmail">Seleccione efectivo</label>
                            </div>
                            <div className="form-floating mb-3">
                                    <select 
                                        className="form-control" 
                                        id="inputEmail" 
                                        type="text" 
                                        value={status} 
                                        onChange={(e) => setStatus(e.target.value)} 
                                    >
                                        <option value="1">ACTIVO</option>
                                        <option value="0">INACTIVO</option>
                                    </select>
                                <label htmlFor="inputEmail">Seleccione el estado</label>
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