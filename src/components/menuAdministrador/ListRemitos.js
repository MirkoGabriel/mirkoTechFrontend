import React, { Component } from 'react'
import axios from 'axios'
import Navigation from './Navigation'
import Cookies from 'universal-cookie'
import { Link } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import swal from 'sweetalert'
import 'react-datepicker/dist/react-datepicker.css'

const cookies = new Cookies()

export default class ListRemitos extends Component {
    state = {
        remitos: [],
        flag: null,
        opcion: '',
        finalDate: '',
        startDate: '',
        nroRemito:''
    }

    async componentDidMount() {
        this.getRemitos()
    }
    filter = async(nroRemito) => {
        const res = await axios.get('http://localhost:8000/api/remito/'+parseInt(nroRemito));
        console.log(res)
        const data=[]
        data.push(res.data)
        this.setState({
            remitos: data
        })
    }
    mirko = (date) => {
        return date.substr(0,10)
    }
    async getRemitos() {
        const res = await axios.get('http://localhost:8000/api/remito/');
        console.log(res.data)
        this.setState({
            remitos: res.data
        })
    }
    buscar = (opcion) => {
        if (opcion === 'default') {
            this.setState({ flag: null })
            this.getRemitos()
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
    filterFechas = async(start, final) => {
        var ini =this.fechaString(start)
        var fin =this.fechaString(final)
        const res = await axios.get('http://localhost:8000/api/remito/?fecha1=' + ini + '&fecha2=' + fin);
        console.log(res.data)
        this.setState({
            remitos: res.data
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
    onChangeDate = startDate => {
        this.setState({ startDate })
    }

    onChangeDate1 = finalDate => {
        this.setState({ finalDate })
    }
    deleteRemito = async (id) => {
        await swal({
            title: 'Delete',
            text: 'No es Recomendable Borrar Remito.Desea continuar?',
            icon: "error",
            buttons: ['No', 'Yes']
        }).then(respuesta => {
            if (respuesta) {
                axios.delete('http://localhost:8000/api/remito/' + id)

                swal({
                    text: 'Remito Deleted',
                    icon: 'success'
                }).then(() => {
                    this.getRemitos()
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
                                            <option value="nro">Número Remito</option>
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
                                                            placeholder="Número Remito"
                                                            name="nroRemito"
                                                            onChange={this.onInputChange}
                                                            value={this.state.nroRemito}
                                                        />
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <button
                                                            className="btn btn-dark"
                                                            onClick={() => this.filter(this.state.nroRemito)}
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
                                                <th scope="col">Nro Remito</th>
                                                <th scope="col">OT</th>
                                                <th scope="col">Cliente</th>
                                                <th scope="col">Fecha</th>
                                                <th scope="col">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.remitos.map(remito => (
                                                    <tr key={remito.id}>
                                                        <th>{remito.id}</th>
                                                        <th>{remito.oti.id}</th>
                                                        <th>{remito.oti.cliente.nombre}</th>
                                                        <th>{this.mirko(remito.fechaIngreso)}</th>
                                                        <th>
                                                            <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                                                <button
                                                                    className="btn btn-danger"
                                                                    onClick={() => this.deleteRemito(remito.id)}
                                                                >
                                                                    Delete
                                                                </button>
                                                                <Link className="btn btn-info" to={'/editRemito/'+remito.id}>
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
