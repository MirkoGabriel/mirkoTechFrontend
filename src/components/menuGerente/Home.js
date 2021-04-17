import React, { Component } from 'react'
import Navigation from './Navigation'
import Cookies from 'universal-cookie'
import logo from '../../icons/gerencia.png'
import { Link } from 'react-router-dom'

const cookies = new Cookies()

export default class Home extends Component {
    render() {
        return (
            (() => {
                if (cookies.get('kind') === 'G') {
                    return (
                        <div>
                            <Navigation />
                            <div className="container p-4">
                                <div className="row justify-content-center pt-5 mt-5 mr-1">
                                    <div className="col-md-4">
                                        <img src={logo} alt="logo"/>
                                    </div>
                                    <div className="col-md-8">
                                        <h1>Tus Tareas Como Gerente Serán:</h1>
                                        <ul>
                                            <li><h4>Acceso total a las tareas de un Técnico ✅.</h4></li>
                                            <li><h4>Acceso total a las tareas de un Administrador ✅.</h4></li>
                                            <li><h4>Gestión de Usuarios, cambio de contraseñas, etc ✅.</h4></li>
                                            <li><h4>Podrás ingresar marcas de equipos y modelos y asignarlos.</h4></li>
                                            <li><h4>Los ingresos de los clientes y actualizaciones serán tu responasibilidad.</h4></li>
                                            <li><h4>Dependera de ti ingresar mercadería nueva y actualizar el stock en todo momento.</h4></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <div className="container">
                            <div className="row justify-content-center pt-5 mt-5 mr-1">
                                <div className="col-md-3 formulario">
                                    <div className="card card-body">
                                        <div className="form-group text-center">
                                            <h4>Error Inicie Sesion Antes</h4>
                                        </div>
                                        <div className="form-group text-center">
                                            <Link className="btn btn-secondary btn-xs btn-block" to="/" >Volver Inicio</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            })()
        )
    }
}
