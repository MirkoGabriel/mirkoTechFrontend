import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { DropdownItem, UncontrolledDropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import swal from 'sweetalert'
import Cookies from 'universal-cookie'

const cookies = new Cookies()

export default class Navigation extends Component {
    print() {
        swal({
            title: 'Salir',
            text: 'Estas seguro que deseas cerrar sesion?',
            icon: "warning",
            buttons: ['No', 'Si']
        }).then(respuesta => {
            if (respuesta) {
                cookies.remove('kind',{path:"/"})
                window.location.href = '/';
            }
        })
    }

    render() {

        return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <Link className="navbar-brand" to="/menuGerente">Menu Gerente</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ml-auto" >
                            <div className="btn">
                                <Link className="btn btn-light" to="/menuTecnico">Técnico</Link>
                            </div>

                            <div className="btn">
                                <Link className="btn btn-light" to="/menuAdministrador">Administrador</Link>
                            </div>

                            <div className="btn">
                                <UncontrolledDropdown>
                                    <DropdownToggle caret  className="btn btn-light">
                                        Stock
                                </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem><Link className="dropdown-item" to="/categoria">Registrar Categoria</Link></DropdownItem>
                                        <DropdownItem><Link className="dropdown-item" to="/producto">Registrar Producto</Link></DropdownItem>
                                        <DropdownItem><Link className="dropdown-item" to="/stock">Stock Productos</Link></DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </div>
                            <div className="btn">
                                <UncontrolledDropdown>
                                    <DropdownToggle caret className="btn btn-light">
                                        Clientes
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem><Link className="dropdown-item" to="/clientes">Registrar Cliente</Link></DropdownItem>
                                        <DropdownItem><Link className="dropdown-item" to="/listClientes">Lista Clientes</Link></DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </div>


                            <div className="btn">
                                <UncontrolledDropdown>
                                    <DropdownToggle caret  className="btn btn-light">
                                        Equipos
                                </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem><Link className="dropdown-item" to="equipoMarca">Registrar Marca</Link></DropdownItem>
                                        <DropdownItem><Link className="dropdown-item" to="equipoModel">Registrar Modelos</Link></DropdownItem>
                                        <DropdownItem><Link className="dropdown-item" to="listEquipo">Lista Equipos</Link></DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </div>
                            <div className="btn">
                                <button
                                    className="btn btn-outline-dark"
                                    onClick={() => this.print()}
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