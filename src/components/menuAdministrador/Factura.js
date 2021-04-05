import React, { Component } from 'react'
import axios from 'axios'
import swal from 'sweetalert'
import Navigation from './Navigation'
import Cookies from 'universal-cookie'
import { Link } from 'react-router-dom'

const cookies = new Cookies()

export default class Factura extends Component {
    state = {
        adminSelected: '',
        admins: [],
        importe: '',
        iva: '',
        total: '',
        descripcion: '',
        OT: '',
        nombreCliente: '',
        contactoCliente: '',
        domicilioCliente: '',
        pagoCliente: '',
        nroFactura: '',
        flag: null,
        fecha: '',
        editing: null
    }

    async componentDidMount() {
        const res = await axios.get('http://localhost:8000/api/users/?kind=A');
        console.log(res.data)
        this.setState({
            admins: res.data.map(admin => admin),
            adminSelected: ''
        })
        if (this.props.match.params.id) {
            const res = await axios.get('http://localhost:8000/api/factura/' + this.props.match.params.id)
            console.log(res.data)
            this.setState({
                flag: true,
                nroFactura: res.data.id,
                adminSelected: res.data.administrador.id,
                descripcion: res.data.informacion,
                OT: res.data.oti.id,
                contactoCliente: res.data.oti.cliente.contacto,
                nombreCliente: res.data.oti.cliente.nombre,
                domicilioCliente: res.data.oti.cliente.domicilio,
                pagoCliente: res.data.oti.cliente.pago,
                fecha: res.data.fechaIngreso.substr(0, 10),
                editing: true,
                importe: res.data.importe,
                iva: Number((parseFloat(res.data.importe) * 0.21).toFixed(2)),
                total: parseFloat(res.data.importe) + (parseFloat(res.data.importe) * 0.21),

            })
        }
    }

    onSubmit = async (e) => {
        e.preventDefault();
        const newFactura = {
            oti: parseInt(this.state.OT),
            administrador: parseInt(this.state.adminSelected),
            informacion: this.state.descripcion,
            importe: parseFloat(this.state.importe)
        }
        console.log(newFactura)
        if (this.state.editing) {
            await axios.put('http://localhost:8000/api/factura/' + parseInt(this.state.nroFactura) + '/', newFactura).then(res => {
                // do stuff
                console.log(res);
                swal({
                    title: 'Factura Ingresada',
                    text: 'Desea imprimir ?',
                    icon: "success",
                    buttons: ['No', 'Si']
                }).then(respuesta => {
                    if (respuesta) {
                        this.setState({
                            fecha: res.data.fechaIngreso.substr(0, 10),
                            nroFactura: res.data.id,
                            flag: true,
                            iva: Number((parseFloat(res.data.importe) * 0.21).toFixed(2)),
                            total: parseFloat(res.data.importe) + (parseFloat(res.data.importe) * 0.21)
                        })
                        window.print()
                        window.location.href = '/listFactura';
                    } else {
                        window.location.href = '/listFactura';
                    }
                })
            })
                .catch(err => {
                    // what now?
                    console.log(err);
                    swal({
                        title: 'Error',
                        text: 'Empty fields',
                        icon: "warning"
                    })
                })
        } else {
            await axios.post('http://localhost:8000/api/factura/', newFactura).then(res => {
                // do stuff

                console.log(res)
                swal({
                    title: 'Factura Ingresada',
                    text: 'Desea imprimir ?',
                    icon: "success",
                    buttons: ['No', 'Si']
                }).then(respuesta => {
                    if (respuesta) {
                        this.setState({
                            fecha: res.data.fechaIngreso.substr(0, 10),
                            nroFactura: res.data.id,
                            flag: true,
                            iva: Number((parseFloat(res.data.importe) * 0.21).toFixed(2)),
                            total: parseFloat(res.data.importe) + (parseFloat(res.data.importe) * 0.21)
                        })
                        window.print()
                        window.location.href = '/menuAdministrador';
                    } else {
                        window.location.href = '/menuAdministrador';
                    }
                })
            }).catch(err => {
                swal({
                    title: 'Error',
                    text: 'Empty fields',
                    icon: "warning"
                })
            })
        }

    }
    buscar = async (id) => {
        await axios.get('http://localhost:8000/api/ordenTrabajo/' + id).then(res => {
            // do stuff
            console.log(res.data)
            if (res.data.estadoEquipo === 'Entregado') {
                this.setState({
                    nombreCliente: res.data.cliente.nombre,
                    contactoCliente: res.data.cliente.contacto,
                    domicilioCliente: res.data.cliente.domicilio,
                    pagoCliente: res.data.cliente.pago
                })
            } else {
                swal({
                    title: 'Error',
                    text: 'La OT Tiene que estar como "Entregado"',
                    icon: "error"
                })
                this.setState({
                    OT: '',
                    idCliente: '',
                    nombreCliente: '',
                    emailCliente: '',
                    telefonoCliente: '',
                    pagoCliente: ''
                })
            }

        }).catch(err => {
            // what now?
            swal({
                title: 'Error',
                text: 'No Existe la OT',
                icon: "error"
            })
            this.setState({
                OT: '',
                idCliente: '',
                nombreCliente: '',
                emailCliente: '',
                telefonoCliente: '',
                pagoCliente: ''
            })
        })
    }
    onInputChange = e => {
        console.log(e.target.name, e.target.value)
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    print() {
        window.print()
    }
    render() {
        return (
            (() => {
                if (cookies.get('kind') === 'A' || cookies.get('kind') === 'G') {
                    return (
                        <div>
                            <Navigation />
                            <div className="container p-4">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-12 p-6">
                                            <div className="card">
                                                <div className="card-header">
                                                    <div className="row justify-content-between">
                                                        <div className="col-sm-4">
                                                            <div className="col-10">
                                                                {(() => {
                                                                    if (this.state.flag === true) {
                                                                        return (
                                                                            <h3>Factura N° {this.state.nroFactura}</h3>
                                                                        )
                                                                    } else {
                                                                        return (
                                                                            <h3>Cargar Factura</h3>
                                                                        )
                                                                    }
                                                                })()}
                                                                <div className="form-group">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="fecha"
                                                                        required
                                                                        value={this.state.fecha}
                                                                        readOnly="readonly"
                                                                        placeholder="Fecha Ingreso"
                                                                    />
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className="col-sm-3">
                                                            <div className="form-group">
                                                                <select
                                                                    className="form-control"
                                                                    name="adminSelected"
                                                                    onChange={this.onInputChange}
                                                                    value={this.state.adminSelected}
                                                                >
                                                                    <option value="">Select Admin</option>
                                                                    {
                                                                        this.state.admins.map(admin =>
                                                                            <option key={admin.id} value={admin.id}>
                                                                                {admin.name}
                                                                            </option>)
                                                                    }
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col-sm-6">
                                                            <div className="form-group">
                                                                <div className="col-10">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="nombreCliente"
                                                                        required
                                                                        value={this.state.nombreCliente}
                                                                        readOnly="readonly"
                                                                        placeholder="Nombre de Cliente"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="form-group">
                                                                <div className="col-10">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="domicilioCliente"
                                                                        required
                                                                        value={this.state.domicilioCliente}
                                                                        readOnly="readonly"
                                                                        placeholder="Domicilio de Cliente"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6">
                                                            <div className="form-group">
                                                                <div className="col-10">

                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="contactoCliente"
                                                                        required
                                                                        value={this.state.contactoCliente}
                                                                        readOnly="readonly"
                                                                        placeholder="Contacto Cliente"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="form-group">
                                                                <div className="col-10">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="pagoCliente"
                                                                        required
                                                                        value={this.state.pagoCliente}
                                                                        readOnly="readonly"
                                                                        placeholder="Condición de Pago"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <table className="table">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">Accion</th>
                                                                <th scope="col">Orden de Trabajo</th>
                                                                <th scope="col">Descripción</th>
                                                                <th scope="col">Importe</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <th scope="col">
                                                                    <button
                                                                        className="btn btn-info"
                                                                        onClick={() => this.buscar(this.state.OT)}
                                                                    >
                                                                        Buscar
                                                                    </button>
                                                                </th>
                                                                <th scope="col">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="Número de OT"
                                                                        name="OT"
                                                                        onChange={this.onInputChange}
                                                                        required
                                                                        value={this.state.OT}
                                                                    />
                                                                </th>
                                                                <th scope="col">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="Descripción"
                                                                        name="descripcion"
                                                                        onChange={this.onInputChange}
                                                                        required
                                                                        value={this.state.descripcion}
                                                                    />
                                                                </th>
                                                                <th scope="col">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="Importe"
                                                                        name="importe"
                                                                        onChange={this.onInputChange}
                                                                        required
                                                                        value={this.state.importe}
                                                                    />
                                                                </th>
                                                            </tr>


                                                            {(() => {
                                                                if (this.state.flag === true) {
                                                                    return (
                                                                        <tr>
                                                                            <th scope="col"> </th>
                                                                            <th scope="col"> </th>
                                                                            <th scope="col"> </th>
                                                                            <th scope="col">IVA</th>
                                                                        </tr>
                                                                    )
                                                                }
                                                            })()}
                                                            {(() => {
                                                                if (this.state.flag === true) {
                                                                    return (
                                                                        <tr>
                                                                            <th scope="col"></th>
                                                                            <th scope="col"></th>
                                                                            <th scope="col"></th>
                                                                            <th scope="col">{this.state.iva}</th>
                                                                        </tr>
                                                                    )
                                                                }
                                                            })()}
                                                            {(() => {
                                                                if (this.state.flag === true) {
                                                                    return (
                                                                        <tr>
                                                                            <th scope="col"> </th>
                                                                            <th scope="col"> </th>
                                                                            <th scope="col"> </th>
                                                                            <th scope="col">Total</th>
                                                                        </tr>
                                                                    )
                                                                }
                                                            })()}
                                                            {(() => {
                                                                if (this.state.flag === true) {
                                                                    return (
                                                                        <tr>
                                                                            <th scope="col"> </th>
                                                                            <th scope="col"> </th>
                                                                            <th scope="col"> </th>
                                                                            <th scope="col">{this.state.total}</th>
                                                                        </tr>
                                                                    )
                                                                }
                                                            })()}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                {/* ACCIONES */}
                                                <div className="card-footer">
                                                    <div className="row justify-content-between">
                                                        <div className="col-sm-4">
                                                            {(() => {
                                                                if (this.state.editing === true) {
                                                                    return (
                                                                        <button type="submit" className="btn btn-info btn-lg" onClick={() => this.print()}>
                                                                            Imprimir
                                                                        </button>
                                                                    )
                                                                }
                                                            })()}
                                                        </div>
                                                        <div className="col-sm-2">

                                                            <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                                                <form onSubmit={this.onSubmit}>
                                                                    <button type="submit" className="btn btn-info btn-lg">
                                                                        Save
                                                                </button>
                                                                </form>

                                                                <Link className="btn btn-danger btn-lg" to="/menuAdministrador" >Exit</Link>
                                                            </div>
                                                        </div>
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
