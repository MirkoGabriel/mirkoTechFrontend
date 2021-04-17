import React, { Component } from 'react'
import axios from 'axios'
import swal from 'sweetalert'
import Navigation from './Navigation'
import Cookies from 'universal-cookie'
import { Link } from 'react-router-dom'

const cookies = new Cookies()

export default class ListEquipos extends Component {
    state = {
        models: [],
        marcas: [],
        marcaSelected: ''
    }
    //carga en el arraymarca la marcas de equipo en el select para filtrar
    async componentDidMount() {
        this.getModels();

        const res = await axios.get('http://localhost:8000/api/equipoMarca/')
        this.setState({
            marcas: res.data.map(marca => marca),
            marcaSelected: ''
        })
    }

    //filtrar modelos por marca
    filter = async (marca) => {
        if (marca === '') {
            this.getModels();
        } else {
            await axios.get('http://localhost:8000/api/equipoModel/?marca=' + parseInt(marca)).then(res => {
                // do stuff
                console.log(res.data)
                this.setState({
                    models: res.data
                })
            }).catch(err => {
                // what now?
                console.log(err);
                swal({
                    text: 'No hay modelos',
                    icon: 'error'
                })
            })
        }
    }
    //obtiene de la bbdd los modelos
    async getModels() {
        const res = await axios.get('http://localhost:8000/api/equipoModel/');
        console.log(res)
        this.setState({
            models: res.data
        })
    }

    // de la accion one click llama a esta funcion mandando el id del model seleccionada y la borra
    deleteModel = async (id) => {
        await swal({
            title: 'Delete',
            text: 'Are you sure you want to delete the Model?',
            icon: "warning",
            buttons: ['No', 'Yes']
        }).then(respuesta => {
            if (respuesta) {
                axios.delete('http://localhost:8000/api/equipoModel/' + id)

                swal({
                    text: 'Model Deleted',
                    icon: 'success'
                }).then(() => {
                    this.getModels()
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
                if (cookies.get('kind') === 'G') {
                    return (
                        <div>
                            <Navigation />
                            <div className="container p-4">
                                <div className="row">
                                    <div className="form-group">
                                        <select
                                            className="form-control"
                                            name="marcaSelected"
                                            onChange={this.onInputChange}
                                            onClick={() => this.filter(this.state.marcaSelected)}
                                        >
                                            <option value="">Select Marca</option>
                                            {
                                                this.state.marcas.map(marca =>
                                                    <option key={marca.id} value={marca.id}>
                                                        {marca.nombreMarca}
                                                    </option>)
                                            }
                                        </select>
                                    </div>
                                    <table className="table table-light table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col">Marca</th>
                                                <th scope="col">Name</th>
                                                <th scope="col">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.models.map(model => (
                                                    <tr key={model.id}>
                                                        <th>{model.marca.nombreMarca}</th>
                                                        <th>{model.nombreModel}</th>
                                                        <th>
                                                            <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                                                <button
                                                                    className="btn btn-danger"
                                                                    onClick={() => this.deleteModel(model.id)}
                                                                >
                                                                    Delete
                                                                </button>
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
