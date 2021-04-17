import React, { Component } from 'react'
import axios from 'axios'
import swal from 'sweetalert'
import Navigation from './Navigation'
import Cookies from 'universal-cookie'
import { Link } from 'react-router-dom'

const cookies = new Cookies()

export default class Historico extends Component {
    state = {
        nroSerie: '',
        OTS: []
    }

    filter = async (nroSerie) => {
        await axios.get('http://localhost:8000/api/ordenTrabajo/?nroSerie=' + nroSerie).then(res => {
            // do stuff
            this.setState({
                OTS: res.data
            })
        }).catch(err => {
            // what now?
            console.log(err);
            this.setState({
                OTS: []
            })
            swal({
                text: 'No hay OT referidas a ese numero de serie',
                icon: 'warning'
            })
        })
        
    }

    onInputChange = e => {

        console.log(e.target.name, e.target.value)
        this.setState({
            [e.target.name]: e.target.value

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
                                        <div className="row justify-content-between">
                                            <div className="col-sm-8 ">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Número de Serie"
                                                    name="nroSerie"
                                                    onChange={this.onInputChange}
                                                    value={this.state.nroSerie}
                                                />
                                            </div>
                                            <div className="col-sm-4">
                                                <button
                                                    className="btn btn-dark"
                                                    onClick={() => this.filter(this.state.nroSerie)}
                                                >
                                                    Buscar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
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
                                                    <tr key={OT.id}>
                                                        <th>{OT.id}</th>
                                                        <th>{OT.cliente.nombre}</th>
                                                        <th>{OT.equipo}</th>
                                                        <th>{OT.marca}</th>
                                                        <th>{OT.modelo}</th>
                                                        <th>{OT.nroSerie}</th>
                                                        <th>{OT.fechaIngreso.substr(0,10)}</th>
                                                        <th>
                                                            <div className="btn-group" role="group" aria-label="Basic mixed styles example">

                                                                <Link className="btn btn-info" to={'/verOT/' + OT.id}>
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
