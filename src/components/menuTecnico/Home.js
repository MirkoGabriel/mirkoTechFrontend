import React, { Component } from 'react'
import Navigation from './Navigation'
import Cookies from 'universal-cookie'
import logo from '../../icons/tecnica.png'
import { Link } from 'react-router-dom'

const cookies = new Cookies()

export default class Home extends Component {
    render() {
        return (
            (() => {
                if (cookies.get('kind') === 'T' || cookies.get('kind') === 'G') {
                    return (
                        <div>
                            <Navigation />
                            <div className="container p-4">
                                <div className="row justify-content-center pt-5 mt-5 mr-1">
                                    <div className="col-md-5">
                                        <img src={logo} alt="logo"/>
                                    </div>
                                    <div className="col-md-7">
                                        <h1>Tus Tareas Como Técnico Serán:</h1>
                                        <ul>
                                            <li><h3>Ingreso de equipos a reparar 💻🖥️📱.</h3></li>
                                            <li><h3>Estar pendiente de su estado según las necesidades del cliente.</h3></li>
                                            <li><h3>Acceso al stock de repuestos. Ojo solo consultar 😉.</h3></li>
                                            <li><h3>Si un equipo vino con anterioridad podrás rastrearlo.</h3></li>
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
