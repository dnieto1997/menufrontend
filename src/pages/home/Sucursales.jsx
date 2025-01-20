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

export const Sucursales = () => {
  const [varSucursales, setVarSucursales] = useState([]);
  const [error, setError] = useState(null);

  const { showLoader, hideLoader } = useLoader();

  const [id, setId] = useState(0);
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [latitud, setLatitud] = useState("");
  const [longitud, setLongitud] = useState("");
  const [telefono, setTelefono] = useState("");
  const [arrHoras, setArrHoras] = useState([
    { dia: "Lunes", fechaA: "", fechaC: "" },
    { dia: "Martes", fechaA: "", fechaC: "" },
    { dia: "Miércoles", fechaA: "", fechaC: "" },
    { dia: "Jueves", fechaA: "", fechaC: "" },
    { dia: "Viernes", fechaA: "", fechaC: "" },
    { dia: "Sábado", fechaA: "", fechaC: "" },
    { dia: "Domingo", fechaA: "", fechaC: "" },
  ]);

  // Días de la semana en orden
  const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  const [ciudad, setCiudad] = useState("");
  const [pais, setPais] = useState("");
  const [estado, setEstado] = useState(1);

  const viewAll = async () => {
    showLoader();
    try {
      const response = await getHttps("sucursal");
      setVarSucursales(response.data);
      hideLoader();
    } catch (error) {
      hideLoader();
      setError(`Error ${error.response?.data?.message}`);
    }
  };

  const agregarDia = () => {
    const horas = Array.isArray(arrHoras) ? arrHoras : [];

    const diasFaltantes = diasSemana.filter(
      (dia) => !horas.some((horario) => horario.dia === dia)
    );

    if (diasFaltantes.length > 0) {
      const nuevoDia = {
        dia: diasFaltantes[0],
        fechaA: "06:00",
        fechaC: "20:00",
      };

      setArrHoras((prev) => [...prev, nuevoDia]);
    } else {
      alert("Todos los días ya han sido agregados.");
    }
  };

  const handleTimeChange = (index, key, value) => {
    const updatedArr = arrHoras.map((horario, i) => {
      if (i === index) {
        const newHorario = { ...horario, [key]: value };

        // Validar que la hora de apertura sea menor que la de cierre
        if (
          key === "fechaA" &&
          newHorario.fechaC &&
          value >= newHorario.fechaC
        ) {
          alert("La hora de apertura debe ser menor que la de cierre.");
          return horario;
        }
        if (
          key === "fechaC" &&
          newHorario.fechaA &&
          value <= newHorario.fechaA
        ) {
          alert("La hora de cierre debe ser mayor que la de apertura.");
          return horario;
        }
        return newHorario;
      }
      return horario;
    });
    setArrHoras(updatedArr);
  };
  const abrirModal = () => {
    setId("0");
    setNombre("");
    setDireccion("");
    setLatitud("");
    setLongitud("");
    setTelefono("");
    setArrHoras([]);
    setCiudad("");
    setPais("");
    setEstado(1);
    $("#exampleModal").modal("show");
  };

  const abrirModalEdit = (
    id,
    nombre,
    direccion,
    latitud,
    longitud,
    telefono,
    arr_horas,
    ciudad,
    pais,
    estado
  ) => {
    let numStatus = 1;
    if (!estado) {
      numStatus = 0;
    }
    const horasA = JSON.parse(arr_horas);
    setId(id);
    setNombre(nombre);
    setDireccion(direccion);
    setLatitud(latitud);
    setLongitud(longitud);
    setTelefono(telefono);
    const formattedArrHoras = diasSemana.map((dia) => {
      const horario = horasA.find((h) => h.dia === dia) || {
        dia,
        fechaA: "",
        fechaC: "",
      };
      return horario;
    });
    setArrHoras(formattedArrHoras);
    setCiudad(ciudad);
    setPais(pais);
    setEstado(numStatus);
    $("#exampleModal").modal("show");
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const adjustedArrHoras = [...arrHoras]; 

    const diasFaltantes = diasSemana.filter(
      (dia) => !adjustedArrHoras.some((horario) => horario.dia === dia)
    );

    // Añadir los días faltantes con los valores predeterminados
    diasFaltantes.forEach((dia) => {
      adjustedArrHoras.push({
        dia,
        fechaA: "06:00",
        fechaC: "20:00",
      });
    });
    try {
      showLoader();
      if (id == 0) {
        const response = await postHttps("sucursal", {
          nombre,
          direccion,
          latitud,
          longitud,
          telefono,
          arr_horas: JSON.stringify(adjustedArrHoras),
          ciudad,
          pais,
          estado:Number(estado),
        });
      } else {
        const response = await pachHttps("sucursal/" + id, {
          nombre,
          direccion,
          latitud,
          longitud,
          telefono,
          arr_horas: JSON.stringify(adjustedArrHoras),
          ciudad,
          pais,
          estado:Number(estado),
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
      const response = await deleteHttps("sucursales", id);
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
    if (varSucursales.length > 0) {
      // Inicializar DataTable solo cuando los usuarios estén cargados
      const tableElement = document.getElementById("myTable");

      if (tableElement) {
        new DataTable("#myTable");
      }

      /* return () => {
                tableElement.destroy();
            } */
    }
  }, [varSucursales]);

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
                      <th scope="col">NOMBRE</th>
                      <th scope="col">DIRECCION</th>
                      <th scope="col">LATITUD</th>
                      <th scope="col">LONGITUD</th>
                      <th scope="col">TELEFONO</th>
                      <th scope="col">CIUDAD</th>
                      <th scope="col">PAIS</th>
                      <th scope="col">ESTADO</th>
                      <th scope="col">ACCION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {varSucursales.length > 0 ? (
                      varSucursales.map((user, index) => (
                        <tr key={index}>
                          <th>{user.id}</th>
                          <td>{user.nombre}</td>
                          <td>{user.direccion}</td>
                          <td>{user.latitud}</td>
                          <td>{user.longitud}</td>
                          <td>{user.telefono}</td>
                          <td>{user.ciudad}</td>
                          <td>{user.pais}</td>
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
                                  user.direccion,
                                  user.latitud,
                                  user.longitud,
                                  user.telefono,
                                  user.arr_horas,
                                  user.ciudad,
                                  user.pais,
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
              <h5 className="modal-title">Sucursal</h5>
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
                    type="text"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    placeholder="Ingrese Direccion"
                  />
                  <label htmlFor="inputEmail">Direccion</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      className="form-control"
                      type="text"
                      value={latitud}
                      onChange={(e) => setLatitud(e.target.value)}
                      placeholder="Ingrese Latitud"
                    />
                    <label htmlFor="inputEmail">Latitud</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      className="form-control"
                      type="text"
                      value={longitud}
                      onChange={(e) => setLongitud(e.target.value)}
                      placeholder="Ingrese Longitud"
                    />
                    <label htmlFor="inputEmail">Longitud</label>
                  </div>
                  <div className="form-floating mb-3">
                    <input
                      className="form-control"
                      type="text"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      placeholder="Ingrese Telefono"
                    />
                    <label htmlFor="inputEmail">Telefono</label>
                  </div>
              
      
                <tbody>
                  <div>
                    <h1 className="mb-4">Horarios de Apertura</h1>
                    <table className="table table-bordered">
                      <thead className="table-secondary">
                        <tr>
                          <th>Día</th>
                          <th>Apertura</th>
                          <th>Cierre</th>
                          <th>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(arrHoras) &&
                          arrHoras.map((horario, index) => (
                            <tr key={index}>
                              <td>{horario.dia}</td>
                              <td>
                                <input
                                  type="time"
                                  className="form-control"
                                  value={horario.fechaA}
                                  onChange={(e) =>
                                    handleTimeChange(
                                      index,
                                      "fechaA",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="time"
                                  className="form-control"
                                  value={horario.fechaC}
                                  onChange={(e) =>
                                    handleTimeChange(
                                      index,
                                      "fechaC",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm"
                                  onClick={() =>
                                    setArrHoras((prev) =>
                                      prev.filter((_, i) => i !== index)
                                    )
                                  }
                                >
                                  <i className="fas fa-trash"></i> Eliminar
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    <button
                      type="button"
                      className="btn btn-success mt-3"
                      onClick={agregarDia}
                    >
                      <i className="fas fa-plus"></i> Agregar Día
                    </button>
                  </div>
                </tbody>
                <br />
                <div className="form-floating mb-3">
                  <select
                    className="form-control"
                    type="text"
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                  >
                    <option value="">Seleccione la ciudad</option>
                    <option value="BARRANQUILLA">Barranquilla</option>
                  </select>
                  <label htmlFor="inputEmail">Seleccione la ciudad</label>
                </div>

                <div className="form-floating mb-3">
                  <select
                    className="form-control"
                    type="text"
                    value={pais}
                    onChange={(e) => setPais(e.target.value)}
                  >
                    <option value="">Seleccione el pais</option>
                    <option value="COLOMBIA">Colombia</option>
                  </select>
                  <label htmlFor="inputEmail">Seleccione el pais</label>
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
