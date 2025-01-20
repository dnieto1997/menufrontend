import Swal from "sweetalert2";
import { Variables } from "../config/Variables";


export const alertConfirmacion = async (mensaje) => {
    try {
        const result = await Swal.fire({
          title: "",
          text: mensaje || "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Si",
          cancelButtonText: "No",
          confirmButtonColor:Variables().colorBtn,
          reverseButtons: true
        });
    
        if (result.isConfirmed) {
          return true;
        } else {
          throw false;
        }
      } catch (error) {
        throw false; // Para propagar el error
      }
}
  