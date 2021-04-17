import React, { Component } from 'react'
import axios from 'axios'
import swal from 'sweetalert'
import Navigation from './Navigation'
import Cookies from 'universal-cookie'
import { Link } from 'react-router-dom'

const cookies = new Cookies()

export default class ordenTrabajo extends Component {
    state = {
        clientes: [],
        marcas: [],
        modelos: [],
        modelAux: [],
        clienteSelected: '',
        marcaSelected: '',
        modelSelected: '',
        tipoEquipo: '',
        descripcion: '',
        nroSerie: '',
        nroOT: ''
    }

    async componentDidMount() {
        this.getClientes();
        this.getMarcas();
        this.getModel();
    }

    //obtiene de la bbdd los clientes
    async getClientes() {
        const res = await axios.get('http://localhost:8000/api/cliente/');
        this.setState({
            // students: res.data.slice(0, 10),
            clientes: res.data
        })
        console.log(this.state.studentsAux)
    }

    //obtiene de la bbdd las marcas
    async getMarcas() {
        const res = await axios.get('http://localhost:8000/api/equipoMarca/');
        this.setState({
            marcas: res.data
        })
    }

    async getModel() {
        const res = await axios.get('http://localhost:8000/api/equipoModel/');
        console.log(res)
        this.setState({
            modelos: res.data
        })
    }

    filter = async (marca) => {
        if (marca !== '') {
            const res = this.state.modelos.filter(pos => pos.marca.nombreMarca === marca)
            if (res.length === 0) {
                swal({
                    title: 'Error',
                    text: 'There are no models in this marca',
                    icon: "warning"
                }).then(() => {
                    window.location.href = '/stockTecnico'
                })
            } else {
                this.setState({ modelAux: res })
            }
        }
    }

    onSubmit = async (e) => {
        e.preventDefault();
        const newOT = {
            cliente: parseInt(this.state.clienteSelected),
            marca: this.state.marcaSelected,
            modelo: this.state.modelSelected,
            descripcion: this.state.descripcion,
            nroSerie: this.state.nroSerie,
            equipo: this.state.tipoEquipo
        };
        console.log(newOT)
        await axios.post('http://localhost:8000/api/ordenTrabajo/', newOT).then(res => {
            // do stuff

            console.log(res)
            swal({
                title: 'Orden de Trabjo Ingresada',
                text: 'Desea imprimir ?',
                icon: "success",
                buttons: ['No', 'Si']
            }).then(respuesta => {
                if (respuesta) {
                    this.setState({ nroOT: res.data.id })
                    window.print()
                    window.location.href = '/ordenTrabajo';
                } else {
                    window.location.href = '/ordenTrabajo';
                }
            })
        })
            .catch(err => {
                swal({
                    title: 'Error',
                    text: 'Empty fields',
                    icon: "warning"
                })
            })
    }

    onInputChange = e => {
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
                                <div className="col-md-6 offset-md-3">
                                    <div className="card card-body">
                                        <h4>Ingreso OT {this.state.nroOT}</h4>

                                        {/** SELECT GROUP */}
                                        <div className="form-group">
                                            <select
                                                className="form-control"
                                                name="clienteSelected"
                                                onChange={this.onInputChange}
                                                value={this.state.clienteSelected}
                                            >
                                                <option value="">Selecciona Cliente</option>
                                                {
                                                    this.state.clientes.map(cliente =>
                                                        <option
                                                            key={cliente.id}
                                                            value={cliente.id}
                                                        >
                                                            {cliente.nombre}
                                                        </option>)
                                                }
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <select
                                                className="form-control"
                                                name="tipoEquipo"
                                                onChange={this.onInputChange}
                                                value={this.state.tipoEquipo}
                                            >

                                                <option value="">Selecciona Tipo</option>
                                                <option value="Pc Escritorio">Pc Escritorio</option>
                                                <option value="Notebook">Notebook</option>
                                                <option value="Celular">Celular</option>
                                                <option value="UPS">UPS</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <select
                                                className="form-control"
                                                name="marcaSelected"
                                                onChange={this.onInputChange}
                                                value={this.state.marcaSelected}
                                                onClick={() => this.filter(this.state.marcaSelected)}
                                            >
                                                <option value="">Select Marca</option>
                                                {
                                                    this.state.marcas.map(marca =>
                                                        <option key={marca.id} value={marca.nombreMarca}>
                                                            {marca.nombreMarca}
                                                        </option>)
                                                }
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <select
                                                className="form-control"
                                                name="modelSelected"
                                                onChange={this.onInputChange}
                                                value={this.state.modelSelected}
                                            >
                                                <option value="">Select Model</option>
                                                {
                                                    this.state.modelAux.map(model =>
                                                        <option key={model.id} value={model.nombreModel}>
                                                            {model.nombreModel}
                                                        </option>)
                                                }
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Descripcion"
                                                name="descripcion"
                                                onChange={this.onInputChange}
                                                value={this.state.descripcion}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Numero de Serie"
                                                name="nroSerie"
                                                onChange={this.onInputChange}
                                                value={this.state.nroSerie}
                                            />
                                        </div>
                                        <form onSubmit={this.onSubmit}>
                                            <button type="submit" className="btn btn-primary">
                                                Save
                                            </button>
                                        </form>
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
