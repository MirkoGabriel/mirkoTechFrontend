import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import swal from 'sweetalert'
import Cookies from 'universal-cookie'
import 'bootstrap/dist/css/bootstrap.min.css';

const cookies = new Cookies()

export default class Navigation extends Component {
    cerrarSesion() {
        swal({
            title: 'Salir',
            text: 'Estas seguro que deseas cerrar sesion?',
            icon: "warning",
            buttons: ['No', 'Si']
        }).then(respuesta => {
            if (respuesta) {
                cookies.remove('kind', { path: "/" })
                window.location.href = '/';
            }
        })
    }

    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <Link className="navbar-brand" to="/menuTecnico">Menu Técnico</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ml-auto" >
                            <div className="btn">
                                <Link className="btn btn-light" to="/ordenTrabajo">Ingreso OT</Link>
                            </div>

                            <div className="btn">
                                <Link className="btn btn-light" to="/seguimiento">Seguimiento</Link>
                            </div>
                            <div className="btn">
                                <Link className="btn btn-light" to="/stockTecnico">Stock</Link>
                            </div>

                            <div className="btn">
                                <Link className="btn btn-light" to="/historico">Consultar historico</Link>
                            </div>
                            {(() => {
                                if (cookies.get('kind') === 'G') {
                                    return (
                                        <div className="btn">
                                            <Link className="btn btn-light" to="/menuGerente">Gerente</Link>
                                        </div>
                                    )
                                }
                            })()}
                            <div className="btn">
                                <button
                                    className="btn btn-outline-dark"
                                    onClick={() => this.cerrarSesion()}
                                >
                                    Cerrar Sesión
                                </button>
                            </div>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}