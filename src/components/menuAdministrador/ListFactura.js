import React, { Component } from 'react'
import axios from 'axios'
import Navigation from './Navigation'
import Cookies from 'universal-cookie'
import { Link } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import swal from 'sweetalert'

const cookies = new Cookies()

export default class ListFactura extends Component {
    state = {
        facturas: [],
        flag: null,
        opcion: '',
        finalDate: '',
        startDate: '',
        nroFactura: ''
    }
    async componentDidMount() {
        this.getFacturas()
    }

    filter = async (nroFactura) => {
        await axios.get('http://localhost:8000/api/factura/' + parseInt(nroFactura)).then(res => {
            // do stuff
            console.log(res)
            const data = []
            data.push(res.data)
            this.setState({
                facturas: data
            })
        })
            .catch(err => {
                // what now?
                console.log(err);
                
                swal({
                    text: 'No hay Facturas',
                    icon: 'error'
                })
                
            })
    }
    filterFechas = async (start, final) => {
        var ini = this.fechaString(start)
        var fin = this.fechaString(final)
        const res = await axios.get('http://localhost:8000/api/factura/?fecha1=' + ini + '&fecha2=' + fin);
        console.log(res.data)
        this.setState({
            facturas: res.data
        })
    }
    fechaString = (fecha) => {
        var date = fecha
        var dia = date.getDate()
        var mes = date.getMonth() + 1
        var ano = date.getFullYear()
        var ini = dia + '/' + mes + '/' + ano
        return ini
    }
    mirko = (date) => {
        return date.substr(0, 10)
    }
    async getFacturas() {
        const res = await axios.get('http://localhost:8000/api/factura/');
        console.log(res.data)
        this.setState({
            facturas: res.data
        })
    }
    buscar = (opcion) => {
        if (opcion === 'default') {
            this.setState({ flag: null })
            this.getFacturas()
        } else if (opcion === 'nro') {
            this.setState({ flag: true })
        } else if (opcion === 'fecha') {
            this.setState({ flag: false })
        }
    }

    onInputChange = e => {

        console.log(e.target.name, e.target.value)
        this.setState({
            [e.target.name]: e.target.value

        })
    }
    onChangeDate = startDate => {
        this.setState({ startDate })
    }

    onChangeDate1 = finalDate => {
        this.setState({ finalDate })
    }
    deleteFactura = async (id) => {
        await swal({
            title: 'Delete',
            text: 'No es Recomendable Borrar FC.Desea continuar?',
            icon: "error",
            buttons: ['No', 'Yes']
        }).then(respuesta => {
            if (respuesta) {
                axios.delete('http://localhost:8000/api/factura/' + id)

                swal({
                    text: 'FC Deleted',
                    icon: 'success'
                }).then(() => {
                    this.getFacturas()
                })
            }
        })
    }
    render() {
        return (
            (() => {
                if (cookies.get('kind') === 'A' || cookies.get('kind') === 'G') {
                    return (
                        <div>
                            <Navigation />
                            <div className="container p-4">
                                <div className="row">
                                    <div className="form-group">
                                        <select
                                            className="form-control"
                                            name="opcion"
                                            onChange={this.onInputChange}
                                            onClick={() => this.buscar(this.state.opcion)}
                                        >
                                            <option value="default">Seleccionar Busqueda</option>
                                            <option value="nro">Número Factura</option>
                                            <option value="fecha">Fechas</option>
                                        </select>
                                    </div>
                                    {(() => {
                                        if (this.state.flag === true) {
                                            return (
                                                <div className="row justify-content-between ml-auto">
                                                    <div className="col-sm-6 ">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Número Factura"
                                                            name="nroFactura"
                                                            onChange={this.onInputChange}
                                                            value={this.state.nroFactura}
                                                        />
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <button
                                                            className="btn btn-dark"
                                                            onClick={() => this.filter(this.state.nroFactura)}
                                                        >
                                                            Buscar
                                                         </button>
                                                    </div>
                                                </div>
                                            )
                                        } else if (this.state.flag === false) {
                                            return (
                                                <div className="row justify-content-between ml-auto">
                                                    <div className="col-sm-2 ">
                                                        <DatePicker
                                                            selected={this.state.startDate}
                                                            onChange={this.onChangeDate}
                                                            dateFormat="dd/MM/yyyy"
                                                            placeholderText="Start Date"
                                                        />
                                                    </div>
                                                    <div className="col-sm-2 ">
                                                        <DatePicker
                                                            selected={this.state.finalDate}
                                                            onChange={this.onChangeDate1}
                                                            dateFormat="dd/MM/yyyy"
                                                            placeholderText="Final Date"
                                                        />
                                                    </div>

                                                    <div className="col-sm-2">
                                                        <button
                                                            className="btn btn-dark btn-sm"
                                                            onClick={() => this.filterFechas(this.state.startDate, this.state.finalDate)}
                                                        >
                                                            Buscar
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    })()}
                                    <table className="table table-light table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col">Nro Factura</th>
                                                <th scope="col">OT</th>
                                                <th scope="col">Cliente</th>
                                                <th scope="col">Fecha</th>
                                                <th scope="col">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.facturas.map(factura => (
                                                    <tr key={factura.id}>
                                                        <th>{factura.id}</th>
                                                        <th>{factura.oti.id}</th>
                                                        <th>{factura.oti.cliente.nombre}</th>
                                                        <th>{factura.fechaIngreso.substr(0, 10)}</th>
                                                        <th>
                                                            <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                                                <button
                                                                    className="btn btn-danger"
                                                                    onClick={() => this.deleteFactura(factura.id)}
                                                                >
                                                                    Delete
                                                                </button>
                                                                <Link className="btn btn-info" to={'/editFactura/' + factura.id}>
                                                                    Edit
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
