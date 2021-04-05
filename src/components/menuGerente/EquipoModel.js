import React, { Component } from 'react'
import axios from 'axios'
import swal from 'sweetalert'
import Navigation from './Navigation'
import Cookies from 'universal-cookie'
import { Link } from 'react-router-dom'

const cookies = new Cookies()

export default class CreateEquipoModels extends Component {
    state = {
        marcas: [],
        marcaSelected: '',
        nombreModel: ''
    }
    //consulto a la bbdd los groupos para guardarlos en el array groups y ponerlo en el select y filtrar
    async componentDidMount() {
        console.log(this.props.match.params)
        const res = await axios.get('http://localhost:8000/api/equipoMarca/')
        this.setState({
            marcas: res.data.map(marca => marca),
            marcaSelected: ''
        })
    }

    //al enviar el form puedo hacer un post o put
    onSubmit = async (e) => {
        e.preventDefault();
        const newModel = {
            marca: this.state.marcaSelected,
            nombreModel: this.state.nombreModel
        };

        
            //si editing esta en false hago un post
            await axios.post('http://localhost:8000/api/equipoModel/', newModel).then(res => {
                // do stuff
                console.log(res);
                swal({
                    text: 'Model Created',
                    icon: 'success'
                }).then(() => {
                    window.location.href = '/equipoModel';
                })
            })
                .catch(err => {
                    // what now?
                    console.log(err);
                    swal({
                        text: 'The subject exists or there is an empty field',
                        icon: 'warning'
                    })
                })
        

    }
    //Seteo en el estado el nombre(que lo relaciono desde el input del form) y el valor deseado
    onInputChange = e => {
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
                                <div className="col-md-6 offset-md-3">
                                    <div className="card card-body">
                                        <h4>Registrar Modelo Equipo</h4>

                                        {/** SELECT GROUP */}
                                        <div className="form-group">
                                            <select
                                                className="form-control"
                                                name="marcaSelected"
                                                onChange={this.onInputChange}
                                                value={this.state.marcaSelected}
                                            >
                                                <option value="">Select a Marca</option>
                                                {
                                                    this.state.marcas.map(marca =>
                                                        <option key={marca.id} value={marca.id}>
                                                            {marca.nombreMarca}
                                                        </option>)
                                                }
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Model Name"
                                                name="nombreModel"
                                                onChange={this.onInputChange}
                                                required
                                                value={this.state.nombreModel}
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
