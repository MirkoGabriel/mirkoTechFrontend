import React, { Component } from 'react'
import axios from 'axios'
import swal from 'sweetalert'
import Navigation from './Navigation'
import Admin from '../menuAdministrador/Navigation'
import Cookies from 'universal-cookie'
import { Link } from 'react-router-dom'

const cookies = new Cookies()

export default class ListClientes extends Component {
    state = {
        clientes: [],
        nombreCliente: '',
        button:''
    }

    async componentDidMount() {
        this.getClientes();
        this.setState({
            button: cookies.get('kind') === 'A' ? 'Ver' : 'Edit'
        })
    }

    //filtrar clientes por nombre
    filter = async (nombre) => {
        console.log(nombre)
        await axios.get('http://localhost:8000/api/cliente/?nombre=' + nombre).then(res => {
            // do stuff
            console.log(res.data)
            this.setState({
                clientes: res.data
            })
        }).catch(err => {
            // what now?
            console.log(err);
            swal({
                text: 'No hay clientes',
                icon: 'error'
            })
        })
    }
    //obtiene de la bbdd de los 10 primeros clientes
    async getClientes() {
        const res = await axios.get('http://localhost:8000/api/cliente/');
        this.setState({
            clientes: res.data
        })
    }

    // de la accion one click llama a esta funcion mandando el id del cliente seleccionada y la borra
    deleteCliente = async (id) => {
        await swal({
            title: 'Delete',
            text: 'Are you sure you want to delete the client?',
            icon: "warning",
            buttons: ['No', 'Yes']
        }).then(respuesta => {
            if (respuesta) {
                axios.delete('http://localhost:8000/api/cliente/' + id)

                swal({
                    text: 'Cliente Deleted',
                    icon: 'success'
                }).then(() => {
                    this.getClientes()
                })
            }
        })
    }

    //Seteo en el estado el nombre(que lo relaciono desde el input del form) y el valor deseado
    onInputChange = e => {
        console.log(e.target.name, e.target.value)
        this.setState({
            [e.target.name]: e.target.value

        })

    }
    render() {
        return (
            (() => {
                if (cookies.get('kind') === 'G' || cookies.get('kind') === 'A') {
                    return (
                        <div>
                            {(() => {
                                if (cookies.get('kind') === 'G') {
                                    return (
                                        <Navigation />
                                    )
                                }else if(cookies.get('kind') === 'A'){
                                    return(
                                        <Admin/>
                                    )
                                }
                            })()}
                            <div className="container p-4">
                                <div className="row">
                                    <div className="form-group">
                                        <div className="row justify-content-between">
                                            <div className="col-sm-6 ">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Buscar Cliente"
                                                    name="nombreCliente"
                                                    onChange={this.onInputChange}
                                                    value={this.state.nombreCliente}
                                                />
                                            </div>
                                            <div className="col-sm-6">
                                                <button
                                                    className="btn btn-dark"
                                                    onClick={() => this.filter(this.state.nombreCliente)}
                                                >
                                                    Buscar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <table className="table table-light table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col">Nombre</th>
                                                <th scope="col">Telefono</th>
                                                <th scope="col">Email</th>
                                                <th scope="col">Condición de Pago</th>
                                                <th scope="col">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.clientes.map(cliente => (
                                                    <tr key={cliente.id}>
                                                        <th>{cliente.nombre}</th>
                                                        <th>{cliente.telefono}</th>
                                                        <th>{cliente.email}</th>
                                                        <th>{cliente.pago}</th>
                                                        <th>
                                                            <div className="btn-group" role="group" aria-label="Basic mixed styles example">

                                                                {(() => {
                                                                    if (cookies.get('kind') === 'G') {
                                                                        return (
                                                                            <button
                                                                                className="btn btn-danger"
                                                                                onClick={() => this.deleteCliente(cliente.id)}
                                                                            >
                                                                                Delete
                                                                            </button>
                                                                        )
                                                                    }
                                                                })()}
                                                                <Link className="btn btn-info" to={'/editCliente/' + cliente.id}>
                                                                    {this.state.button}
                                                                </Link>
                                                            </div>
                                                        </th>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
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
