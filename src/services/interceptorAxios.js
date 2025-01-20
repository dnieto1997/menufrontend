import axios from "axios";

export const setupAxiosInterceptors = (navigate) => {
    axios.interceptors.response.use(
        response => response,
        error => {
            if (error.response && error.response.status === 403) {
                navigate('/home/forbidden'); // Redirige a la página de Forbidden sin recargar la página
            }else if (error.response && error.response.status === 401) {
                localStorage.removeItem('authToken');
                navigate('/login');
            }
            return Promise.reject(error);
        }
    );
}
