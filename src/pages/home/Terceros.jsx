import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteHttps, getHttps, pachHttps, postHttps } from "../../services/https";
import { alertConfirmacion } from "../../services/alerta";
import { Variables } from "../../config/Variables"
import { useLoader } from '../../context/PreloadContext';
import Swal from "sweetalert2";


export const Terceros = () => {

    const [varTerceros, setVarTerceros] = useState([]);
    const { showLoader, hideLoader } = useLoader();

    const [id, setId] = useState(0);
    const [tipoPersona, setTipoPersona] = useState('');
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [tipoIdentificacion, setTipoIdentificacion] = useState('');
    const [numIdentificacion, setNumIdentificacion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [listDireccion, setListDireccion] = useState('');

    const viewAll = async () => {
        showLoader();
        try {
            const response = await getHttps('terceros');
            setVarTerceros(response.data);
            hideLoader();
        } catch (error) {
            hideLoader();
            setError(`Error ${error.response?.data?.message}`);
        }
    }

    const abrirModal = () => {
        setId('0')
        setTipoPersona('');
        setNombre('');
        setCorreo('');
        setTipoIdentificacion('');
        setNumIdentificacion('');
        setTelefono('');
        setListDireccion('');
        $('#exampleModal').modal('show');
    }

    const onSubmit = async (event) => {
        event.preventDefault();
      
        try {
            showLoader();

            let formItem = {
                tipo_persona: tipoPersona,
                nombre: nombre,
                correo: correo,
                tipo_identificacion: tipoIdentificacion,
                num_identificacion: numIdentificacion,
                telefono: telefono,
                list_direccion: listDireccion,
              }

            if(id==0){
                const response = await postHttps('terceros', formItem );
            }else{
                const response = await pachHttps('terceros/'+id, formItem );
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

    const abrirModalEdit = ( id,
        tipo_persona,
        nombre,
        correo,
        tipo_identificacion,
        num_identificacion,
        telefono,
        list_direccion
    ) => {
       
        setId(id)
        setTipoPersona(tipo_persona);
        setNombre(nombre);
        setCorreo(correo);
        setTipoIdentificacion(tipo_identificacion);
        setNumIdentificacion(num_identificacion);
        setTelefono(telefono);
        setListDireccion(list_direccion);
        $('#exampleModal').modal('show');
    }

    const deleteItem = async (id) => {
        try {
            const mensaje = await alertConfirmacion('¿Estás seguro de eliminar este registro?');
            showLoader();
            const response = await deleteHttps('terceros', id); 
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
        if (varTerceros.length > 0) {

            // Inicializar DataTable solo cuando los usuarios estén cargados
            const tableElement = document.getElementById('myTable');
            
            if (tableElement) {
                new DataTable('#myTable');
            }

            /* return () => {
                tableElement.destroy();
            } */
        }
    }, [varTerceros]);

    return(
        <>
             <main>
                <div className="container-fluid px-4">
                    <h1 className="mt-4">Terceros</h1>
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item"><Link to="/home/dashboard">Dashboard</Link></li>
                        <li className="breadcrumb-item active">Terceros</li>
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
                                            <th scope="col">TIPO DOCUMENTO</th>
                                            <th scope="col">NUMERO DOCUMENTO</th>
                                            <th scope="col">NOMBRE</th>
                                            <th scope="col">ACCION</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        
                                        {varTerceros.length > 0 ? (
                                            varTerceros.map((user, index) => (
                                                <tr key={index}>
                                                    <th>{user.id}</th>
                                                    <td>{user.nom_tipo_identificacion}</td>
                                                    <td>{user.num_identificacion}</td>
                                                    <td>{user.nombre}</td>
                                                    <td>
                                                        <button 
                                                            type="button" 
                                                            className="btn btn-primary" 
                                                            onClick={
                                                                () =>  abrirModalEdit(
                                                                    user.id,
                                                                    user.tipo_persona,
                                                                    user.nombre,
                                                                    user.correo,
                                                                    user.tipo_identificacion,
                                                                    user.num_identificacion,
                                                                    user.telefono,
                                                                    user.list_direccion)}>
                                                                        <i className="far fa-edit"></i>
                                                        </button> 
                                                        &nbsp;
                                                        <button type="button" className="btn btn-danger" onClick={() =>  deleteItem(user.id)}><i className="fas fa-trash"></i></button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center">Cargando terceros...</td>
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
                        <h5 className="modal-title">Terceros</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={onSubmit}>

                            <div className="form-floating mb-3">
                                <input 
                                    type="hidden" 
                                    value={id} 
                                    onChange={(e) => setId(e.target.value)}  />
                                <select 
                                        className="form-control" 
                                        type="text" 
                                        value={tipoPersona} 
                                        onChange={(e) => setTipoPersona(e.target.value)}>
                                    <option value="">Seleccione efectivo</option> 
                                    <option value="2">Persona Natural y asimiladas</option>
                                    <option value="1">Persona Jurídica y asimiladas</option>
                                </select>
                                <label htmlFor="inputEmail">Seleccione tipo de persona</label>
                            </div>

                            <div className="form-floating mb-3">
                                
                                <input 
                                    className="form-control" 
                                    id="inputEmail" 
                                    type="text" 
                                    value={nombre} 
                                    onChange={(e) => setNombre(e.target.value)} 
                                    placeholder="Ingrese Nombre" 
                                    />
                                <label htmlFor="inputEmail">Nombre</label>
                            </div>

                            <div className="form-floating mb-3">
                                
                                <input 
                                    className="form-control" 
                                    id="inputEmail" 
                                    type="text" 
                                    value={correo} 
                                    onChange={(e) => setCorreo(e.target.value)} 
                                    placeholder="Ingrese Correo" 
                                    />
                                <label htmlFor="inputEmail">Correo</label>
                            </div>

                            <div className="form-floating mb-3">
                                    <select 
                                        className="form-control" 
                                        type="text" 
                                        value={tipoIdentificacion} 
                                        onChange={(e) => setTipoIdentificacion(e.target.value)} 
                                    >
                                        <option value="">Seleccione tipo documento</option> 
                                        <option value="13">Cédula de ciudadanía</option>
                                        <option value="31">NIT</option>
                                        <option value="11">Registro civil</option>
                                        <option value="12">Tarjeta de identidad</option>
                                        <option value="21">Tarjeta de extranjería **</option>
                                        <option value="22">Cédula de extranjería **</option>
                                        <option value="41">Pasaporte</option>
                                        <option value="42">Documento de identificación extranjero **</option>
                                        <option value="47">PEP (Permiso Especial de Permanencia)</option>
                                        <option value="48">PPT (Permiso Protección Temporal)</option>
                                        <option value="50">NIT de otro país ***</option>
                                        <option value="91">NUIP *</option>
                                    </select>
                                <label htmlFor="inputEmail">Seleccione tipo documento</label>
                            </div>

                            <div className="form-floating mb-3">
                                
                                <input 
                                    className="form-control" 
                                    id="inputEmail" 
                                    type="text" 
                                    value={numIdentificacion} 
                                    onChange={(e) => setNumIdentificacion(e.target.value)} 
                                    placeholder="Ingrese Correo" 
                                    />
                                <label htmlFor="inputEmail">Numero de Identificacion</label>
                            </div>

                            <div className="form-floating mb-3">
                                
                                <input 
                                    className="form-control" 
                                    id="inputEmail" 
                                    type="text" 
                                    value={telefono} 
                                    onChange={(e) => setTelefono(e.target.value)} 
                                    placeholder="Ingrese Correo" 
                                    />
                                <label htmlFor="inputEmail">Telefono</label>
                            </div>

                            <div className="form-floating mb-3">
                                
                                <input 
                                    className="form-control" 
                                    id="inputEmail" 
                                    type="text" 
                                    value={listDireccion} 
                                    onChange={(e) => setListDireccion(e.target.value)} 
                                    placeholder="Ingrese Correo" 
                                    />
                                <label htmlFor="inputEmail">Direciion</label>
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