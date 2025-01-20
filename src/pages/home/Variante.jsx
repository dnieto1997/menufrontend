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

export const Variante = () => {
  const { isName, isType } = useLogIn();

  const [varVariantes, setvarVariantes] = useState([]);
  const [error, setError] = useState(null);

  const { showLoader, hideLoader } = useLoader();

  const [id, setId] = useState(0);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [estado, setEstado] = useState(1);

  const viewAll = async () => {
    try {
      const response = await getHttps("variante");
      setvarVariantes(response.data);
    } catch (error) {
      setError(`Error ${error.response?.data?.message}`);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      showLoader();

      if (id == 0) {
        const response = await postHttps("variante", {
          nombre,
          precio,
          estado: Number(estado),
        });
      } else {
        const response = await pachHttps("variante/" + id, {
          nombre,
          precio,
          estado: Number(estado),
        });
        console.log(response);
      }

      hideLoader();
      $("#exampleModal").modal("hide");
      viewAll();
    } catch (error) {
      console.log(error);
      hideLoader();
      Swal.fire(
        "Error de validacion",
        `${error.response?.data?.message}`,
        "error"
      );
    }
  };

  const abrirModal = () => {
    setId(0);
    setNombre("");
    setPrecio("");

    $("#exampleModal").modal("show");
  };

  const abrirModalEdit = (id, nombre, precio, estado) => {
    const numStatus = estado ? 1 : 0;
    setId(id);
    setNombre(nombre);
    setPrecio(precio);
    setEstado(numStatus);

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
  }, []);

  useEffect(() => {
    if (varVariantes.length > 0) {
      // Inicializar DataTable solo cuando los usuarios estén cargados
      const tableElement = document.getElementById("myTable");

      if (tableElement) {
        new DataTable("#myTable");
      }

      /* return () => {
                tableElement.destroy();
            } */
    }
  }, [varVariantes]); // Se ejecuta cuando varUsers cambie

  return (
    <>
      <main>
        <div className="container-fluid px-4">
          <h1 className="mt-4">Variantes</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/home/dashboard">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active">Variantes</li>
          </ol>
          <div className="card mb-4">
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}

              <button
                className={`btn btn-${Variables().classBtn}`}
                onClick={abrirModal}
              >
                Crear Variantes
              </button>
              <hr />
              <div className="table-responsive">
                <table className="table table-bordered" id="myTable">
                  <thead className={`table-${Variables().classTable}`}>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">NOMBRE</th>
                      <th scope="col">PRECIO</th>
                      <th scope="col">ESTADO</th>
                      <th scope="col">ACCION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {varVariantes.length > 0 ? (
                      varVariantes.map((empresa, index) => (
                        <tr key={empresa.id}>
                          <th>{empresa.id}</th>
                          <td>{empresa.nombre}</td>
                          <td>
                          
                            {new Intl.NumberFormat("es-ES", {
                              style: "currency",
                              currency: "COP",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(empresa.precio)}
                          </td>
                          <td>
                            {empresa.estado ? (
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
                                  empresa.id,
                                  empresa.nombre,
                                  empresa.precio,
                                  empresa.estado
                                )
                              }
                            >
                              <i className="far fa-edit"></i>
                            </button>
                            &nbsp;
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => deleteItem(empresa.id)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">
                          Cargando variantes...
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
              <h5 className="modal-title">Crear Variante</h5>
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
                    type="number"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    placeholder="Ingrese Precio"
                  />
                  <label htmlFor="inputEmail">Precio</label>
                </div>

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
