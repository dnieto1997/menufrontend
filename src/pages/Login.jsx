import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginHttps } from '../services/https';

export const Login = () => {

    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await loginHttps({ user, password });

            const token = response.data.token;

            if (token) {

                localStorage.setItem('authToken', JSON.stringify(response.data));
                
                navigate('/home');
            } else {
                setError('Usuario o contraseña incorrectos');
            }  
        } catch (error) {
            setError(`Error ${error.response?.data?.message}`);
        }
    };

    return (
        <>
            <div className="bg-primary">
                <div id="layoutAuthentication">
                    <div id="layoutAuthentication_content">
                        <main>
                            <div className="container">
                                <div className="row justify-content-center">
                                    <div className="col-lg-5">
                                        <div className="card shadow-lg border-0 rounded-lg mt-5">
                                            <div className="card-header"><h3 className="text-center font-weight-light my-4">Login</h3></div>
                                            <div className="card-body">
                                                <form onSubmit={handleLogin}>
                                                    <div className="form-floating mb-3">
                                                        <input 
                                                            className="form-control" 
                                                            id="inputEmail" 
                                                            type="text" 
                                                            value={user} 
                                                            onChange={(e) => setUser(e.target.value)} 
                                                            placeholder="Ingrese su usuario" 
                                                            />
                                                        <label htmlFor="inputEmail">Usuario</label>
                                                    </div>
                                                    <div className="form-floating mb-3">
                                                        <input 
                                                            className="form-control" 
                                                            id="inputPassword" 
                                                            type="password" 
                                                            value={password} 
                                                            onChange={(e) => setPassword(e.target.value)} 
                                                            placeholder="Ingrese su contraseña" 
                                                            />
                                                        <label htmlFor="inputPassword">Password</label>
                                                    </div>

                                                    <div className="d-flex align-items-center justify-content-between mt-4 mb-0">
                                                        <a className="small">&nbsp;</a>
                                                        <button className="btn btn-primary" type="submit">Login</button>
                                                    </div>
                                                </form>
                                            </div>
                                            <div className="card-footer text-center py-3">
                                                <div className="small"> 
                                                    {error &&   
                                                        <div className="alert alert-danger" role="alert">
                                                        {error}
                                                        </div>
                                                    }

                                                  
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                    <div id="layoutAuthentication_footer">
                        <footer className="py-4 bg-light mt-auto">
                            <div className="container-fluid px-4">
                                <div className="d-flex align-items-center justify-content-between small">
                                    <div className="text-muted">Copyright &copy; Your Website 2025</div>
                                    <div>
                                        <a href="#">Privacy Policy</a>
                                        &middot;
                                        <a href="#">Terms &amp; Conditions</a>
                                    </div>
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}