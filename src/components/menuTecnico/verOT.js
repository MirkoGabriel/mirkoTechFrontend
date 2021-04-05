import React, { Component } from 'react'
import axios from 'axios'
import Navigation from './Navigation'
import Cookies from 'universal-cookie'
import { Link } from 'react-router-dom'

const cookies = new Cookies()

export default class verOT extends Component {
    state = {
        id: '',
        equipo: '',
        marca: '',
        modelo: '',
        descripcion: '',
        nroSerie: '',
        fechaIngreso: '',
        estadoEquipo: '',
        pago: '',
        fechaEstEqui: '',
        estadoPresupuesto: '',
        fechaEstPresu: '',
        tecnico: '',
        cliente: '',
        tareas:[]
    }
    async componentDidMount() {
        this.getOT();
    }
    async getOT() {
        const res = await axios.get('http://localhost:8000/api/ordenTrabajo/' + this.props.match.params.id)
        var desc

        if (res.data.descripcion === null) {
            desc = ''
        } else {
            desc = res.data.descripcion
        }
        const date = new Date(res.data.fechaEstPresu)
        const dia = date.getDate()
        const mes = date.getMonth() + 1
        const ano = date.getFullYear()
        const fechaPresu = dia + '/' + mes + '/' + ano
        const date1 = new Date(res.data.fechaEstEqui)
        const dia1 = date1.getDate()
        const mes1 = date1.getMonth() + 1
        const ano1 = date1.getFullYear()
        const fechaEqui = dia1 + '/' + mes1 + '/' + ano1
        this.setState({
            fechaIngreso: res.data.fechaIngreso,
            equipo: res.data.equipo,
            modelo: res.data.modelo,
            marca: res.data.marca,
            nroSerie: res.data.nroSerie,
            cliente: res.data.cliente.nombre,
            telefono: res.data.cliente.telefono,
            email: res.data.cliente.email,
            pago: res.data.cliente.pago,
            id: this.props.match.params.id,
            tecnico: res.data.tecnico.name,
            estadoEquipo: res.data.estadoEquipo,
            estadoPresupuesto: res.data.estadoPresupuesto,
            fechaEstPresu: fechaPresu,
            fechaEstEqui: fechaEqui,
            descripcion: desc
        })
        console.log(this.state)

        this.getTareasOT();
    }
    async getTareasOT() {
        console.log(this.state.id)
        await axios.get('http://localhost:8000/api/tareasOT/?ot=' + this.state.id).then(res => {
            // do stuff
            console.log(res.data)
            this.setState({
                tareas: res.data.map(tarea => tarea)
            })
        })
            .catch(err => {
                // what now?
                this.setState({
                    tarea: []
                })
            })
            console.log(this.state.id)
    }
    render() {
        return (
            (() => {
                if (cookies.get('kind') === 'T' || cookies.get('kind') === 'G') {
                    return (
                        <div>
                            <Navigation />
                            <div className="container p-4">
                                <div className="row">
                                    <div className="col-md-12 p-6">
                                        <div className="card">
                                            {/* OT*/}
                                            <div className="card-header">
                                                <div className="row justify-content-between">
                                                    <div className="col-sm-4">
                                                        <h3>OT N° {this.state.id}</h3>
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="tecnico"
                                                            required
                                                            value={this.state.tecnico}
                                                            readOnly="readonly"
                                                            placeholder="Tecnico"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* DETALLE OT*/}
                                            <div className="card-body">
                                                <div className="row justify-content-between">
                                                    <div className="col-sm-3">
                                                        <div className="alert alert-light text-center">
                                                            <h5>Cliente</h5>
                                                            <p>{this.state.cliente}</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <div className="alert alert-light text-center">
                                                            <h5>Teléfono</h5>
                                                            <p>{this.state.telefono}</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <div className="alert alert-light text-center">
                                                            <h5>Email</h5>
                                                            <p>{this.state.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <div className="alert alert-light text-center">
                                                            <h5>Condición Pago</h5>
                                                            <p>{this.state.pago}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row justify-content-between">
                                                    <div className="col-sm-3">
                                                        <div className="alert alert-light text-center">
                                                            <h5>Equipo</h5>
                                                            <p>{this.state.equipo}</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <div className="alert alert-light text-center">
                                                            <h5>Marca</h5>
                                                            <p>{this.state.marca}</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <div className="alert alert-light text-center">
                                                            <h5>Modelo</h5>
                                                            <p>{this.state.modelo}</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <div className="alert alert-light text-center">
                                                            <h5>Número Serie</h5>
                                                            <p>{this.state.nroSerie}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* TAREAS REALIZADAS*/}
                                            <div className="card-header text-center">
                                                <h5>Detalle de Tareas</h5>
                                            </div>
                                            <div className="card-body">
                                                <div className="container">

                                                    <table className="table">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">Repuesto</th>
                                                                <th scope="col">Marca</th>
                                                                <th scope="col">Cantidad</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                this.state.tareas.map(tarea => (
                                                                    <tr key={tarea.id}>
                                                                        <th>{tarea.categoria}</th>
                                                                        <th>{tarea.producto}</th>
                                                                        <th>{tarea.cantidad}</th>
                                                                    </tr>
                                                                ))
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>


                                            {/* EQUIPO PRESUPUESTO*/}

                                            <div className="card-header text-center">
                                                <div className="row">
                                                    <div className="col-6">
                                                        <h5>Estado Equipo</h5>
                                                    </div>
                                                    <div className="col-6">
                                                        <h5>Estado Presupuesto</h5>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <div className="row justify-content-between">
                                                    <div className="col-sm-3">
                                                        <div className="alert alert-light text-center">
                                                            <h5>Estado Equipo</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <div className="alert alert-light text-center">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="estadoEquipo"
                                                                placeholder="Estado Equipo"
                                                                required
                                                                value={this.state.estadoEquipo}
                                                                readOnly="readonly"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <div className="alert alert-light text-center">
                                                            <h5>Estado Presupuesto</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <div className="alert alert-light text-center">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="estadoPresupuesto"
                                                                placeholder="Estado Presupuesto"
                                                                required
                                                                value={this.state.estadoPresupuesto}
                                                                readOnly="readonly"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row justify-content-between">
                                                    <div className="col-sm-3">
                                                        <div className="alert alert-light text-center">
                                                            <h5>Fecha Equipo</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <div className="alert alert-light text-center">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="fechaEstEqui"
                                                                required
                                                                value={this.state.fechaEstEqui}
                                                                readOnly="readonly"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <div className="alert alert-light text-center">
                                                            <h5>Fecha Presupuesto</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <div className="alert alert-light text-center">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="fechaEstPresu"
                                                                required
                                                                value={this.state.fechaEstPresu}
                                                                readOnly="readonly"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* DETALLE TAREAS */}
                                            <div className="card-header text-center">
                                                <h5>Detalle de Tareas</h5>
                                            </div>
                                            <div className="card-body">
                                                <textarea
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Tareas Realizadas"
                                                    name="descripcion"
                                                    value={this.state.descripcion}
                                                    readOnly="readonly"
                                                />
                                            </div>

                                            {/* ACCIONES */}
                                            <div className="card-footer">
                                                <div className="row justify-content-between">
                                                    <div className="col-sm-4">
                                                    </div>
                                                    <div className="col-sm-1">

                                                            <Link className="btn btn-danger btn-lg" to="/historico" >Exit</Link>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div >

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
