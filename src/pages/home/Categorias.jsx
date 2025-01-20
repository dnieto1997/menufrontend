import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteHttps,
  getHttps,
  pachHttps,
  postHttps,
} from "../../services/https";
import { alertConfirmacion } from "../../services/alerta";
import { Variables } from "../../config/Variables";
import { useLoader } from "../../context/PreloadContext";
import Swal from "sweetalert2";

export const Categorias = () => {
  const [varCategorias, setVarCategorias] = useState([]);

  const { showLoader, hideLoader } = useLoader();

  const [id, setId] = useState(0);
  const [nombre, setNombre] = useState("");
  const [order, setOrder] = useState("");
  const [img, setImg] = useState("");
  const [arrHoras, setArrHoras] = useState([
    { dia: "Lunes", fechaA: "", fechaC: "" },
    { dia: "Martes", fechaA: "", fechaC: "" },
    { dia: "Miércoles", fechaA: "", fechaC: "" },
    { dia: "Jueves", fechaA: "", fechaC: "" },
    { dia: "Viernes", fechaA: "", fechaC: "" },
    { dia: "Sábado", fechaA: "", fechaC: "" },
    { dia: "Domingo", fechaA: "", fechaC: "" },
  ]);
  const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];
  const [estado, setEstado] = useState(1);

  const viewAll = async () => {
    showLoader();
    try {
      const response = await getHttps("categorias");
      setVarCategorias(response.data);
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
    setOrder("");
    setImg("");
    setArrHoras([]);
    setEstado(1);
    $("#exampleModal").modal("show");
  };

  const abrirModalEdit = (id, nombre, order, imagen, arr_horas, estado) => {
    console.log(estado);
    let numStatus = 1;
    if (!estado) {
      numStatus = 0;
    }
    const horasA = JSON.parse(arr_horas);

    setId(id);
    setNombre(nombre);
    setOrder(order);
    setImg(imagen);

    const formattedArrHoras = diasSemana.map((dia) => {
      const horario = horasA.find((h) => h.dia === dia) || {
        dia,
        fechaA: "",
        fechaC: "",
      };
      return horario;
    });
    setArrHoras(formattedArrHoras);
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
        const response = await postHttps("categorias", {
          nombre,
          order,
          img,
          gr_hora: JSON.stringify(adjustedArrHoras),
          estado: Number(estado),
        });
      } else {
        const response = await pachHttps("categorias/" + id, {
          nombre,
          order,
          img,
          gr_hora: JSON.stringify(adjustedArrHoras),
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
      const response = await deleteHttps("categorias", id);
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
    if (varCategorias.length > 0) {
      // Inicializar DataTable solo cuando los usuarios estén cargados
      const tableElement = document.getElementById("myTable");

      if (tableElement) {
        new DataTable("#myTable");
      }

      /* return () => {
                tableElement.destroy();
            } */
    }
  }, [varCategorias]);

  return (
    <>
      <main>
        <div className="container-fluid px-4">
          <h1 className="mt-4">Categorias</h1>
          <ol className="breadcrumb mb-4">
            <li className="breadcrumb-item">
              <Link to="/home/dashboard">Dashboard</Link>
            </li>
            <li className="breadcrumb-item active">Categorias</li>
          </ol>
          <div className="card mb-4">
            <div className="card-body">
              <button
                className={`btn btn-${Variables().classBtn}`}
                onClick={abrirModal}
              >
                Crear Categoria
              </button>
              <hr />
              <div className="table-responsive">
                <table className="table table-bordered" id="myTable">
                  <thead className={`table-${Variables().classTable}`}>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">NOMBRE</th>
                      <th scope="col">POSICION</th>
                      <th scope="col">IMAGEN</th>
                      <th scope="col">ESTADO</th>
                      <th scope="col">ACCION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {varCategorias.length > 0 ? (
                      varCategorias.map((user, index) => (
                        <tr key={index}>
                          <th>{user.id}</th>
                          <td>{user.nombre}</td>
                          <td>{user.order}</td>
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
                                  user.order,
                                  user.imagen,
                                  user.gr_hora,
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
                          Cargando categorias...
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
              <h5 className="modal-title">Categoria</h5>
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
                    id="inputEmail"
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    placeholder="Ingrese la posicion"
                  />
                  <label htmlFor="inputEmail">Posicion</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    id="inputEmail"
                    type="text"
                    value={img}
                    onChange={(e) => setImg(e.target.value)}
                    placeholder="Ingrese la Imagen"
                  />
                  <label htmlFor="inputEmail">Imagen</label>
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
