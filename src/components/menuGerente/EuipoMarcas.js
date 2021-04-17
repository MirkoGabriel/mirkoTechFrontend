import React, { Component } from 'react'
import axios from 'axios'
import swal from 'sweetalert'
import Navigation from './Navigation'
import Cookies from 'universal-cookie'

import { Link } from 'react-router-dom'

const cookies = new Cookies()

export default class CreateStudents extends Component {

    state = {
        equipoMarcas: [],
        nombreMarca: ''
    }

    async componentDidMount() {
        this.getEquipoMarca();
    }

    getEquipoMarca = async () => {
        const res = await axios.get('http://localhost:8000/api/equipoMarca/');
        this.setState({ equipoMarcas: res.data });
    }

    deleteMarca = async (id) => {
        console.log(typeof (id))
        await swal({
            title: 'Delete',
            text: 'Are you sure you want to delete the Marca?',
            icon: "warning",
            buttons: ['No', 'Yes']
        }).then(respuesta => {
            if (respuesta) {
                axios.delete('http://localhost:8000/api/equipoMarca/' + id + '/')

                swal({
                    text: 'Marca Deleted',
                    icon: 'success'
                }).then(() => {

                    this.getEquipoMarca();
                })
            }
        })


    }

    onChangeNombreMarca = (e) => {
        this.setState({
            nombreMarca: e.target.value
        })
    }

    onSubmit = async e => {
        e.preventDefault();
        await axios.post('http://localhost:8000/api/equipoMarca/', {
            nombreMarca: this.state.nombreMarca
        })
        this.setState({ nombreMarca: '' });
        this.getEquipoMarca();
        //window.location.href = '/equipoMarca';
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
                                    <div className="col-md-4">
                                        <div className="card card-body">
                                            <h3>Ingresar nueva marca</h3>
                                            <form onSubmit={this.onSubmit}>
                                                <div className="form-group">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Name"
                                                        value={this.state.nombreMarca}
                                                        onChange={this.onChangeNombreMarca} />
                                                </div>
                                                <button type="submit" className="btn btn-primary">Save</button>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="col-md-8">
                                        <ul className="list-group">
                                            {
                                                this.state.equipoMarcas.map(marca => (
                                                    <li className="list-group-item list-group-item-action"
                                                        key={marca.id}
                                                        onDoubleClick={() => this.deleteMarca(marca.id)}
                                                    >
                                                        {marca.nombreMarca}
                                                    </li>))
                                            }
                                        </ul>
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
