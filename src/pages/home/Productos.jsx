import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  deleteHttps,
  getHttps,
  pachHttps,
  postHttps,
} from "../../services/https";
import { alertConfirmacion } from "../../services/alerta";
import { Variables } from "../../config/Variables";

import { LoaderProvider, useLoader } from "../../context/PreloadContext";
import Swal from "sweetalert2";

export const Productos = () => {
  const [varCategoria, setvarCategoria] = useState([]);
  const [varProducto, setvarProducto] = useState([]);
  const [varGrupoVariante, setvarGrupoVariante] = useState([]);
  const [error, setError] = useState(null);

  const { showLoader, hideLoader } = useLoader();

  const [id, setId] = useState(0);
  const [nombre, setNombre] = useState("");
  const [img, setImg] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, SetDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [estrella, SetEstrella] = useState("");
  const [nuevo, setNuevo] = useState("");
  const [promocion, setPromocion] = useState("");
  const [precio2, SetPrecio2] = useState("");
  const [variantegrupo, setVariantegrupo] = useState("");
  const [estado, setEstado] = useState(1);

  const viewAll = async () => {
    showLoader();
    try {
      const response = await getHttps("productos");
      setvarProducto(response.data);
      hideLoader();
    } catch (error) {
      hideLoader();
      setError(`Error ${error.response?.data?.message}`);
    }
  };

  const viewCategorias = async () => {
    showLoader();
    try {
      const response = await getHttps("categorias");
      setvarCategoria(response.data);
      hideLoader();
    } catch (error) {
      hideLoader();
      setError(`Error ${error.response?.data?.message}`);
    }
  };

  const viewvarianteGrupo = async () => {
    showLoader();
    try {
      const response = await getHttps("variantegrupo");
      setvarGrupoVariante(response.data);
      hideLoader();
    } catch (error) {
      hideLoader();
      setError(`Error ${error.response?.data?.message}`);
    }
  };

  const abrirModal = () => {
    setId("0");
    setNombre("");
    setImg("");
    setCategoria("");
    SetDescripcion("");
    SetEstrella("");
    setNuevo("");
    setPromocion("");
    setPrecio("");
    SetPrecio2("");
    setVariantegrupo("");
    setEstado(1);
    $("#exampleModal").modal("show");
  };

  const abrirModalEdit = (
    id,
    img,
    nombre,
    categoria,
    descripcion,
    precio,
    estrella,
    nuevo,
    promocion,
    precio2,
    variantegrupo,
    estado
  ) => {
    let numStatus = 1;
    if (!estado) {
      numStatus = 0;
    }

    setId(id);
    setImg(img);
    setNombre(nombre);
    setCategoria(categoria);
    SetDescripcion(descripcion);
    setPrecio(precio);
    SetEstrella(estrella);
    setNuevo(nuevo);
    setPromocion(promocion);
    SetPrecio2(precio2);
    setVariantegrupo(variantegrupo);
    setEstado(numStatus);
    $("#exampleModal").modal("show");
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      showLoader();
      if (id == 0) {
        const response = await postHttps("productos", {
          img,
          nombre,
          categoria,
          descripcion,
          precio,
          estrella,
          nuevo: Number(nuevo),
          promocion: Number(promocion),
          precio2,
          variantegrupo,
          estado: Number(estado),
        });
      } else {
        const response = await pachHttps("productos/" + id, {
          img,
          nombre,
          categoria,
          descripcion,
          precio,
          estrella,
          nuevo: Number(nuevo),
          promocion: Number(promocion),
          precio2,
          variantegrupo,
          estado: Number(estado),
        });
      }

      hideLoader();
      $("#exampleModal").modal("hide");
      viewAll();
    } catch (error) {
      hideLoader();
      Swal.fire(
        "Error de validacion",
        `${error.response?.data?.message}`,
        "error"
      );
    }
  };

  const deleteItem = async (id) => {
    try {
      const mensaje = await alertConfirmacion(
        "¿Estás seguro de eliminar este registro?"
      );
      showLoader();
      const response = await deleteHttps("producto", id);
      hideLoader();
      await viewAll();
    } catch (error) {
      hideLoader();
      /*  console.log(error);  */
    }
  };

  useEffect(() => {
    viewAll();
    viewCategorias();
    viewvarianteGrupo();
  }, []);

  useEffect(() => {
    if (varProducto.length > 0) {
      // Inicializar DataTable solo cuando los usuarios estén cargados
      const tableElement = document.getElementById("myTable");

      if (tableElement) {
        new DataTable("#myTable");
      }

      /* return () => {
                tableElement.destroy();
            } */
    }
  }, [varProducto]);

  return (
    <>
      <main>
        <div className="container-fluid px-4">
          <h1 className="mt-4">Sucursales</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/home/dashboard">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active">Sucursales</li>
          </ol>
          <div className="card mb-4">
            <div className="card-body">
              {error && <div className="alert alert-danger">{error}</div>}

              <button
                className={`btn btn-${Variables().classBtn}`}
                onClick={abrirModal}
              >
                Crear Sucursales
              </button>
              <hr />
              <div className="table-responsive">
                <table className="table table-bordered" id="myTable">
                  <thead className={`table-${Variables().classTable}`}>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">IMG</th>
                      <th scope="col">NOMBRE</th>
                      <th scope="col">CATEGORIA</th>
                      <th scope="col">DESCRIPCION</th>
                      <th scope="col">PRECIO</th>
                      <th scope="col">ESTRELLA</th>
                      <th scope="col">NUEVO</th>
                      <th scope="col">PROMOCION</th>
                      <th scope="col">PRECIO2</th>
                      <th scope="col">GRUPO DE VARIANTE</th>
                      <th scope="col">ESTADO</th>
                      <th scope="col">ACCION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {varProducto.length > 0 ? (
                      varProducto.map((user, index) => (
                        <tr key={index}>
                          <th>{user.id}</th>
                          <td>
                            {" "}
                            <img
                              src={user.imagen}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                borderRadius: "5px", // Bordes redondeados opcionales
                              }} // Controlar el tamaño
                            />
                          </td>

                          <td>{user.nombre}</td>
                          <td>{user.categoria}</td>
                          <td>{user.descripcion}</td>
                          <td>   {new Intl.NumberFormat("es-ES", {
                              style: "currency",
                              currency: "COP",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(user.precio)}</td>
                          <td>{user.estrella}</td>
                          <td>{user.nuevo}</td>
                          <td>{user.promocion}</td>
                          <td>{user.precio2}</td>
                          <td>{user.variantegrupo}</td>
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
                                  user.img,
                                  user.nombre,
                                  user.categoria,
                                  user.descripcion,
                                  user.precio,
                                  user.estrella,
                                  user.nuevo,
                                  user.promocion,
                                  user.precio2,
                                  user.variantegrupo,
                                  user.estado
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
                          Cargando productos...
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
              <h5 className="modal-title">Producto</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={onSubmit}>
                {/* Nombre */}
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ingrese Nombre"
                  />
                  <label htmlFor="inputNombre">Nombre</label>
                </div>

                {/* Imagen */}
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    type="text"
                    value={img}
                    onChange={(e) => setImg(e.target.value)}
                    placeholder="Ingrese URL de la imagen"
                  />
                  <label htmlFor="inputImg">Imagen (URL)</label>
                </div>

                {/* Categoría */}
                <div className="form-floating mb-3">
                  <select
                    className="form-control"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                  >
                    <option value="">Seleccione una Categoria</option>
                    {varCategoria.map((empresa) => (
                      <option key={empresa.id} value={empresa.id}>
                        {empresa.nombre}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="empresaSelect">
                    Seleccione una Categoria
                  </label>
                </div>

                {/* Descripción */}
                <div className="form-floating mb-3">
                  <textarea
                    className="form-control"
                    value={descripcion}
                    onChange={(e) => SetDescripcion(e.target.value)}
                    placeholder="Ingrese Descripción"
                    style={{ height: "100px" }}
                  ></textarea>
                  <label htmlFor="inputDescripcion">Descripción</label>
                </div>

                {/* Precio */}
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    type="number"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                    placeholder="Ingrese Precio"
                  />
                  <label htmlFor="inputPrecio">Precio</label>
                </div>

                {/* Estrella */}
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    type="number"
                    value={estrella}
                    onChange={(e) => SetEstrella(e.target.value)}
                    placeholder="Ingrese Estrella (rating)"
                  />
                  <label htmlFor="inputEstrella">Estrella (rating)</label>
                </div>

                {/* Nuevo */}
                <div className="form-floating mb-3">
                  <select
                    className="form-control"
                    value={nuevo}
                    onChange={(e) => setNuevo(e.target.value)}
                  >
                    <option value="">Seleccione si es nuevo</option>
                    <option value="1">Sí</option>
                    <option value="0">No</option>
                  </select>
                  <label htmlFor="inputNuevo">¿Es nuevo?</label>
                </div>

                {/* Promoción */}

                <div className="form-floating mb-3">
                  <select
                    className="form-control"
                    value={promocion}
                    onChange={(e) => setPromocion(e.target.value)}
                  >
                    <option value="">Seleccione si tiene promocion</option>
                    <option value="1">Sí</option>
                    <option value="0">No</option>
                  </select>
                  <label htmlFor="inputNuevo">¿Tiene Promocion?</label>
                </div>
                {/* Precio 2 */}
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    type="number"
                    value={precio2}
                    onChange={(e) => SetPrecio2(e.target.value)}
                    placeholder="Ingrese Precio 2"
                  />
                  <label htmlFor="inputPrecio2">Precio 2</label>
                </div>

                {/* Variante grupo */}
                <div className="form-floating mb-3">
                  <select
                    className="form-control"
                    value={variantegrupo}
                    onChange={(e) => setVariantegrupo(e.target.value)}
                  >
                    <option value="">Seleccione un grupo de variante</option>
                    {varGrupoVariante.map((empresa) => (
                      <option key={empresa.id} value={empresa.id}>
                        {empresa.nombre}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="empresaSelect">
                    Seleccione un grupo de Variante
                  </label>
                </div>

                
                <div className="form-floating mb-3">
                  <select
                    className="form-control"
                    id="inputEmail"
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
