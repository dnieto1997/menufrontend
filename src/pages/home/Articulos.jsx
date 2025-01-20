import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteHttps, getHttps, pachHttps, postHttps } from "../../services/https";
import { alertConfirmacion } from "../../services/alerta";
import { Variables } from "../../config/Variables"
import { useLoader } from '../../context/PreloadContext';
import Swal from "sweetalert2";

export const Articulos = () => {

    const [varArticulos, setVarArticulos] = useState([]);
    const [varCategoria, setVarCategoria] = useState([]);

    const { showLoader, hideLoader } = useLoader();

    const [id, setId] = useState(0);
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [iva, setIva] = useState('');
    const [impco, setImpco] = useState('');
    const [icui, setIcui] = useState('');
    const [ibu, setIbu] = useState('');
    const [price1, setPrice1] = useState('');
    const [price2, setPrice2] = useState('');
    const [price3, setPrice3] = useState('');
    const [cost, setCost] = useState('');
    const [und, setUnd] = useState('');
    const [status, setStatus] = useState(1);
    const [selectedCategoria, setSelectedCategoria] = useState([]);


    const viewAll = async () => {
        showLoader();
        try {
            const response = await getHttps('articulos');
            setVarArticulos(response.data);
            hideLoader();
        } catch (error) {
            hideLoader();
            setError(`Error ${error.response?.data?.message}`);
        }
    }

    const categoriaAll = async () => {
        try {
            const response = await getHttps('categorias');
            setVarCategoria(response.data);
        } catch (error) {
            setError(`Error ${error.response?.data?.message}`);
        }
    }

    const abrirModal = () => {

        setId('0')
        setCode('');
        setName('');
        setCategory('');
        setSelectedCategoria(varCategoria);
        setIva('');
        setImpco('');
        setIcui('');
        setIbu('');
        setPrice1('');
        setPrice2('');
        setPrice3('');
        setCost('');
        setUnd('');
        setStatus(1)
        $('#exampleModal').modal('show');
    }

    const abrirModalEdit = (id,code,name,category,iva,impco,icui,ibu,price1,price2,price3,cost,und,estado) => {
        let numStatus = 1;
        if(!estado){
            numStatus = 0;
        }

        console.log( category )

        setId(id)
        setCode(code);
        setName(name);
        setCategory(category);
        setIva(iva);
        setImpco(impco);
        setIcui(icui);
        setIbu(ibu);
        setPrice1(price1);
        setPrice2(price2);
        setPrice3(price3);
        setCost(cost);
        setUnd(und);
        $('#exampleModal').modal('show');
    }

    const onSubmit = async (event) => {
        event.preventDefault();
      
        let estado = Number(status);
        try {
            showLoader();
            if(id==0){
                const response = await postHttps('articulos',{ code,name,category,iva,impco,icui,ibu,price1,price2,price3,cost,und,status:estado});
            }else{
                const response = await pachHttps('articulos/'+id,{ code,name,category,iva,impco,icui,ibu,price1,price2,price3,cost,und,status:estado});
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
            const response = await deleteHttps('articulos', id); 
            hideLoader();
            await viewAll(); 
          } catch (error) {
            hideLoader();
            //console.log(error); 
          }
    }

    useEffect(() => {
        viewAll();
        categoriaAll();
    }, []);

    useEffect(() => {
        viewAll();
    }, []);

    useEffect(() => {
        if (varArticulos.length > 0) {

            // Inicializar DataTable solo cuando los usuarios estén cargados
            const tableElement = document.getElementById('myTable');
            
            if (tableElement) {
                new DataTable('#myTable');
            }

            /* return () => {
                tableElement.destroy();
            } */
        }
    }, [varArticulos]);

    return(
        <>
             <main>
                <div className="container-fluid px-4">
                    <h1 className="mt-4">Articulos</h1>
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item"><Link to="/home/dashboard">Dashboard</Link></li>
                        <li className="breadcrumb-item active">Articulos</li>
                    </ol>
                    <div className="card mb-4">
                        <div className="card-body"> 
                            
                            <button className={`btn btn-${Variables().classBtn}`} onClick={abrirModal}>Crear Articulo</button>
                            <hr />
                            <div className="table-responsive">
                                <table className="table table-bordered" id="myTable">
                                    <thead className={`table-${Variables().classTable}`}>
                                        <tr >
                                            <th scope="col">ID</th>
                                            <th scope="col">CODIGO</th>
                                            <th scope="col">NOMBRE</th>
                                            <th scope="col">PRECIO</th>
                                            <th scope="col">IMPUESTOS</th>
                                            <th scope="col">ESTADO</th>
                                            <th scope="col">ACCION</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        
                                        {varArticulos.length > 0 ? (
                                            varArticulos.map((user, index) => (
                                                <tr key={index}>
                                                    <th>{user.id}</th>
                                                    <td>{user.code}</td>
                                                    <td>{user.name}</td>
                                                    <td>
                                                        <p>
                                                            precio1: {user.price1} <br />
                                                            precio2: {user.price2} <br />
                                                            precio3: {user.price3} <br />
                                                        </p>
                                                       
                                                    </td>
                                                    <td>
                                                        <p>
                                                            iva: {user.iva} <br />
                                                            impcon: {user.impco} <br />
                                                            ibu: {user.ibu} <br />
                                                            icui: {user.icui} <br />
                                                        </p>
                                                       
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
                                                                    user.code,
                                                                    user.name,
                                                                    user.category,
                                                                    user.iva,
                                                                    user.impco,
                                                                    user.icui,
                                                                    user.ibu,
                                                                    user.price1,
                                                                    user.price2,
                                                                    user.price3,
                                                                    user.cost,
                                                                    user.und,
                                                                    user.status
                                                                )
                                                            }>
                                                            <i className="far fa-edit"></i>
                                                        </button> 
                                                        &nbsp;
                                                        <button type="button" className="btn btn-danger" onClick={() =>  deleteItem(user.id)}><i className="fas fa-trash"></i></button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center">Cargando categorias...</td>
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
                                            id="inputEmail" 
                                            type="text" 
                                            value={code} 
                                            onChange={(e) => setCode(e.target.value)} 
                                            placeholder="Ingrese Codigo" 
                                            />
                                        <label htmlFor="inputEmail">Codigo</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    
                                    <div className="form-floating mb-3">
                                        <input 
                                            className="form-control" 
                                            id="inputEmail" 
                                            type="text" 
                                            value={name} 
                                            onChange={(e) => setName(e.target.value)} 
                                            placeholder="Ingrese el nombre" 
                                            />
                                        <label htmlFor="inputEmail">Nombre</label>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                            <select 
                                                className="form-control" 
                                                value={category} 
                                                onChange={(e) => setCategory(e.target.value)} 
                                            >
                                                <option value="">Seleccione categoria</option> 
                                                {selectedCategoria.map((sucursal) => (
                                                    <option key={sucursal.id} value={sucursal.id}>{sucursal.name}</option>
                                                ))}
                                            </select>
                                        <label htmlFor="inputEmail">Seleccione categoria</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input 
                                            className="form-control" 
                                            id="inputEmail" 
                                            type="number" 
                                            value={iva} 
                                            onChange={(e) => setIva(e.target.value)} 
                                            placeholder="Ingrese el iva" 
                                            />
                                        <label htmlFor="inputEmail">Iva</label>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input 
                                            className="form-control" 
                                            id="inputEmail" 
                                            type="number" 
                                            value={impco} 
                                            onChange={(e) => setImpco(e.target.value)} 
                                            placeholder="Ingrese el impco" 
                                            />
                                        <label htmlFor="inputEmail">Impco</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input 
                                            className="form-control" 
                                            id="inputEmail" 
                                            type="number" 
                                            value={icui} 
                                            onChange={(e) => setIcui(e.target.value)} 
                                            placeholder="Ingrese el icui" 
                                            />
                                        <label htmlFor="inputEmail">Icui</label>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input 
                                            className="form-control" 
                                            id="inputEmail" 
                                            type="number" 
                                            value={ibu} 
                                            onChange={(e) => setIbu(e.target.value)} 
                                            placeholder="Ingrese el ibu" 
                                            />
                                        <label htmlFor="inputEmail">Ibu</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input 
                                            className="form-control" 
                                            id="inputEmail" 
                                            type="number" 
                                            value={price1} 
                                            onChange={(e) => setPrice1(e.target.value)} 
                                            placeholder="Ingrese el precio 1" 
                                            />
                                        <label htmlFor="inputEmail">Precio 1</label>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input 
                                            className="form-control" 
                                            id="inputEmail" 
                                            type="number" 
                                            value={price2} 
                                            onChange={(e) => setPrice2(e.target.value)} 
                                            placeholder="Ingrese el precio 2" 
                                            />
                                        <label htmlFor="inputEmail">Precio 2</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input 
                                            className="form-control" 
                                            id="inputEmail" 
                                            type="number" 
                                            value={price3} 
                                            onChange={(e) => setPrice3(e.target.value)} 
                                            placeholder="Ingrese el precio 3" 
                                            />
                                        <label htmlFor="inputEmail">Precio 3</label>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                        <input 
                                            className="form-control" 
                                            id="inputEmail" 
                                            type="number" 
                                            value={cost} 
                                            onChange={(e) => setCost(e.target.value)} 
                                            placeholder="Ingrese el costo" 
                                            />
                                        <label htmlFor="inputEmail">Costo</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                            <select 
                                                className="form-control" 
                                                id="inputEmail" 
                                                value={und} 
                                                onChange={(e) => setUnd(e.target.value)} 
                                            >
                                                <option value="">Seleccione unidad de medida</option> 
                                                <option value="UND">UNIDAD</option>
                                                <option value="KL">KILOS</option>
                                                <option value="GR">GRAMOS</option>
                                                <option value="L">LITRO</option>
                                                <option value="ML">MILILITRO</option>
                                                <option value="PT">POTE</option>
                                                <option value="OZ">ONZA</option>
                                                <option value="BL">BOLSA</option>
                                            </select>
                                        <label htmlFor="inputEmail">Seleccione unidad de medida</label>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-floating mb-3">
                                            <select 
                                                className="form-control" 
                                                id="inputEmail" 
                                                value={status} 
                                                onChange={(e) => setStatus(e.target.value)} 
                                            >
                                                <option value="1">ACTIVO</option>
                                                <option value="0">INACTIVO</option>
                                            </select>
                                        <label htmlFor="inputEmail">Seleccione el estado</label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    
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
    )
}