import { Link } from "react-router-dom";
import {
  deleteHttps,
  getHttps,
  pachHttps,
  postHttps,
} from "../../services/https";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Variables } from "../../config/Variables";
import { alertConfirmacion } from "../../services/alerta";

import { LoaderProvider, useLoader } from "../../context/PreloadContext";
import { useLogIn } from "../../context/logInContext";

export const Users = () => {
  const { isName, isType } = useLogIn();

  const [varUsers, setVarUsers] = useState([]);
  const [error, setError] = useState(null);
  const [varEmpresas, setVarEmpresas] = useState([]);

  const { showLoader, hideLoader } = useLoader();

  const [id, setId] = useState(0);
  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [tipo, setTipo] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [estado, setEstado] = useState(1);

  const viewEmpresa = async () => {
    try {
      const response = await getHttps("empresas");

      setVarEmpresas(response.data);
    } catch (error) {
      setError(`Error ${error.response?.data?.message}`);
    }
  };

  const viewAll = async () => {
    try {
      const response = await getHttps("usuario");
      setVarUsers(response.data);
    } catch (error) {
      setError(`Error ${error.response?.data?.message}`);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      showLoader();
      console.log(id);

      const payload = {
        nombre,
        usuario,
        tipo,
        estado: Number(estado),
        empresa,
      };

      if (clave) {
        payload.clave = clave;
      }

      if (id === 0) {
        const response = await postHttps("usuario", payload);
        Swal.fire("Éxito", "Usuario creado correctamente", "success");
      } else {
        console.log(nombre, usuario, tipo, estado, empresa);
        const response = await pachHttps(`usuario/${id}`, payload);
        Swal.fire("Éxito", "Usuario actualizado correctamente", "success");
      }

      limpiarDatos();
      hideLoader();
      $("#exampleModal").modal("hide");
      viewAll(); // Refrescar la tabla de usuarios
    } catch (error) {
      hideLoader();
      console.error(error);
      Swal.fire(
        "Error de validación",
        `${error.response?.data?.message || "Error desconocido"}`,
        "error"
      );
    }
  };

  const limpiarDatos = () => {
    setId(0);
    setNombre("");
    setUsuario("");
    setClave("");
    setTipo("");
    setEstado(1);
    setEmpresa("");
  };

  const abrirModal = () => {
    setNombre("");
    setUsuario("");
    setClave("");
    setTipo("");
    setEmpresa("");
    $("#exampleModal").modal("show");
  };

  const abrirModalEdit = (id, nombre, usuario, tipo, estado, empresa) => {

      
  
    const numStatus = estado ? 1 : 0;

    setId(id); // Aquí se asegura que el ID correcto se configure
    setNombre(nombre);
    setUsuario(usuario);
    setClave(""); // La clave queda vacía para evitar sobrescritura accidental
    setTipo(tipo);
    setEstado(numStatus); // Asegurar que el estado sea numérico
    if(empresa){
      setEmpresa(empresa);
    }else {
      setEmpresa("")
    }

    // Abrir el modal para edición
    $("#exampleModal").modal("show");
  };
  const deleteItem = async (id) => {
    try {
      const mensaje = await alertConfirmacion(
        "¿Estás seguro de eliminar este registro?"
      );
      showLoader();
      const response = await deleteHttps("usuario", id);
      hideLoader();
      await viewAll();
    } catch (error) {
      hideLoader();
      /*  console.log(error);  */
    }
  };

  useEffect(() => {
    viewAll();
    viewEmpresa();
  }, []);

  useEffect(() => {
    if (varUsers.length > 0) {
      // Inicializar DataTable solo cuando los usuarios estén cargados
      const tableElement = document.getElementById("myTable");

      if (tableElement) {
        new DataTable("#myTable");
      }

      /* return () => {
                tableElement.destroy();
            } */
    }
  }, [varUsers]);

  return (
    <>
      <main>
        <div className="container-fluid px-4">
          <h1 className="mt-4">Usuarios</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/home/dashboard">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active">Usuarios</li>
          </ol>
          <div className="card mb-4">
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}

              <button
                className={`btn btn-${Variables().classBtn}`}
                onClick={abrirModal}
              >
                Crear Usuario
              </button>
              <hr />
              <div className="table-responsive">
                <table className="table table-bordered" id="myTable">
                  <thead className={`table-${Variables().classTable}`}>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">NOMBRE</th>
                      <th scope="col">EMPRESA</th>
                      <th scope="col">USUARIO</th>
                      <th scope="col">TIPO</th>
                      <th scope="col">ESTADO</th>
                      <th scope="col">ACCION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {varUsers.length > 0 ? (
                      varUsers.map((user, index) => (
                        <tr key={user.id}>
                          <th>{user.id}</th>
                          <td>{user.nombre}</td>
                          <td>{user.empresa}</td>
                          <td>{user.usuario}</td>
                          <td>{user.tipo}</td>
                          <td>
                            {user.estado ? (
                              <span className="badge bg-success">Activo</span>
                            ) : (
                              <span className="badge bg-danger">Inactivo</span>
                            )}
                          </td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={() =>
                                abrirModalEdit(
                                  user.id,
                                  user.nombre,
                                  user.usuario,
                                  user.tipo,
                                  user.estado,
                                  user.empresa
                                )
                              }
                            >
                              <i className="far fa-edit"></i>
                            </button>
                            &nbsp;
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => deleteItem(user.id)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">
                          Cargando usuarios...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div
        className="modal"
        data-bs-backdrop="static"
        tabIndex="-1"
        id="exampleModal"
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className={`modal-header btn btn-${Variables().classHeader}`}>
              <h5 className="modal-title">Crear Usuario</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={onSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="hidden"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                  />
                  <input
                    className="form-control"
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
                    type="text"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    placeholder="Ingrese Usuario"
                  />
                  <label htmlFor="inputEmail">Usuario</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    type="password"
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                    placeholder="Ingrese su contraseña"
                  />
                  <label htmlFor="inputPassword">Contraseña</label>
                </div>
                <div className="form-floating mb-3">
                  <select
                    className="form-control"
                    type="text"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                  >
                    <option value="">Seleccione el rol</option>
                    <option value="USER">USUARIO</option>
                    {isType !== "ADMIN" && (
                      <option value="MASTER">MAESTRO</option>
                    )}
                    <option value="ADMIN">ADMINISTRATIVO</option>
                  </select>
                  <label htmlFor="inputEmail">Seleccione el rol</label>
                </div>

                {tipo == "USER" && (
                  <div className="form-floating mb-3">
                    <select
                      className="form-control"
                      value={empresa}
                      onChange={(e) => setEmpresa(e.target.value)}
                    >
                      <option value="">Seleccione una empresa</option>
                      {varEmpresas.map((empresa) => (
                        <option key={empresa.id} value={empresa.id}>
                          {empresa.nombre}
                        </option>
                      ))}
                    </select>
                    <label htmlFor="empresaSelect">
                      Seleccione una empresa
                    </label>
                  </div>
                )}
                <div className="form-floating mb-3">
                  <select
                    className="form-control"
                    type="text"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                  >
                    <option value="1">ACTIVO</option>
                    <option value="0">INACTIVO</option>
                  </select>
                  <label htmlFor="inputEmail">Seleccione el estado</label>
                </div>

                <div className="d-flex align-items-center justify-content-between mt-4 mb-0">
                  <a className="small">&nbsp;</a>
                  <button className="btn btn-primary" type="submit">
                    Guardar
                  </button>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
