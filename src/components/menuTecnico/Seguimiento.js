import React, { Component } from 'react'
import axios from 'axios'
import swal from 'sweetalert'
import Navigation from './Navigation'
import Cookies from 'universal-cookie'
import { Link } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const cookies = new Cookies()

export default class Seguimiento extends Component {
    state = {
        OTSAux: [],
        OTS: [],
        opcion: '',
        flag: null,
        nroOT: '',
        finalDate: '',
        startDate: ''
    }
    //obtengo los 10 primeras ot
    async componentDidMount() {
        this.getOTS()
    }

    //filtrar OT por el numero solo las que no figuran como 'entregado'
    filter = async (OT) => {
        if (OT === '') {
            swal({
                title: 'Error',
                text: 'Ingrese un número',
                icon: "error"
            })
        } else {
            await axios.get('http://localhost:8000/api/ordenTrabajo/' + parseInt(OT)).then(res => {
                // do stuff
                console.log(res.data)
                if (res.data.estadoEquipo === 'Entregado') {
                    swal({
                        text: 'No hay ot que este en proceso de revision',
                        icon: 'error'
                    })
                } else {
                    const data = []
                    data.push(res.data)
                    this.setState({
                        OTS: data
                    })
                }
            })
                .catch(err => {
                    // what now?
                    console.log(err);
                    swal({
                        text: 'No hay ot que este en proceso de revision',
                        icon: 'error'
                    })
                })

        }
    }
    /**Filtro las OT en dos fechas establecidas */
    filterFechas = async (start, final) => {
        var ini = this.fechaString(start)
        var fin = this.fechaString(final)
        const res = await axios.get('http://localhost:8000/api/ordenTrabajo/?fecha1=' + ini + '&fecha2=' + fin);
        console.log(res.data)
        this.setState({
            OTS: res.data
        })
    }
    fechaString = (date) => {
        var dia = date.getDate()
        var mes = date.getMonth() + 1
        var ano = date.getFullYear()
        var fecha = dia + '/' + mes + '/' + ano

        return fecha
    }

    estado = (estado) => {
        if (estado === 'Reparado') {
            return 'table-success'
        } else if (estado === 'No Reparado') {
            return 'table-danger'
        }
    }

    buscar = (opcion) => {
        if (opcion === 'default') {
            this.setState({ flag: null })
            this.getOTS()
        } else if (opcion === 'nro') {
            this.setState({ flag: true })
        } else if (opcion === 'fecha') {
            this.setState({ flag: false })
        }
    }
    //obtiene de la bbdd todas las OT
    async getOTS() {
        const res = await axios.get('http://localhost:8000/api/ordenTrabajo/?estado=Entregado')
        this.setState({
            OTS: res.data
        })
    }


    //Seteo en el estado el nombre(que lo relaciono desde el input del form) y el valor deseado
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
    deleteOT = async (id) => {
        await swal({
            title: 'Delete',
            text: 'No es Recomendable Borrar OT. Pero antes de hacerlo corrobora que devolviste repuestos!!!',
            icon: "error",
            buttons: ['No', 'Yes']
        }).then(respuesta => {
            if (respuesta) {
                axios.delete('http://localhost:8000/api/ordenTrabajo/' + id)

                swal({
                    text: 'OT Deleted',
                    icon: 'success'
                }).then(() => {
                    this.getOTS()
                })
            }
        })
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
                                    <div className="form-group">
                                        <select
                                            className="form-control"
                                            name="opcion"
                                            onChange={this.onInputChange}
                                            onClick={() => this.buscar(this.state.opcion)}
                                        >
                                            <option value="default">Seleccionar Busqueda</option>
                                            <option value="nro">Número OT</option>
                                            <option value="fecha">Fechas</option>
                                        </select>
                                    </div>
                                
                            {
                        (() => {
                            if (this.state.flag === true) {
                                return (
                                    <div className="row justify-content-between ml-auto">
                                        <div className="col-sm-6 ">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Número OT"
                                                name="nroOT"
                                                onChange={this.onInputChange}
                                                value={this.state.nroOT}
                                            />
                                        </div>
                                        <div className="col-sm-6">
                                            <button
                                                className="btn btn-dark"
                                                onClick={() => this.filter(this.state.nroOT)}
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
                        })()
                    }



                    <table className="table table-light table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Número OT</th>
                                <th scope="col">Cliente</th>
                                <th scope="col">Tipo</th>
                                <th scope="col">Marca</th>
                                <th scope="col">Modelo</th>
                                <th scope="col">Número de Serie</th>
                                <th scope="col">Fecha Ingreso</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.OTS.map(OT => (
                                    <tr key={OT.id} className={this.estado(OT.estadoEquipo)}>
                                        <th>{OT.id}</th>
                                        <th>{OT.cliente.nombre}</th>
                                        <th>{OT.equipo}</th>
                                        <th>{OT.marca}</th>
                                        <th>{OT.modelo}</th>
                                        <th>{OT.nroSerie}</th>
                                        <th>{OT.fechaIngreso.substr(0, 10)}</th>
                                        <th>
                                            <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => this.deleteOT(OT.id)}
                                                >
                                                    Delete
                                                                </button>
                                                <Link className="btn btn-info" to={'/editOT/' + OT.id}>
                                                    Edit
                                                                </Link>
                                            </div>
                                        </th>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                        </div >
                            </div >
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
