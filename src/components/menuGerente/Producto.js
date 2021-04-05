import React, { Component } from 'react'
import axios from 'axios'
import swal from 'sweetalert'
import Navigation from './Navigation'
import Cookies from 'universal-cookie'
import { Link } from 'react-router-dom'

const cookies = new Cookies()

export default class Producto extends Component {
    state = {
        stock: [],
        marca: '',
        modelo: '',
        descripcion: '',
        cantidad: '',
        nroSerie: '',
        categoria: '',
        editing: false,
        id: '',
        titulo: ''
    }
    //consulto a la bbdd los groupos para guardarlos en el array groups y ponerlo en el select y filtrar
    async componentDidMount() {
        const res = await axios.get('http://localhost:8000/api/stock/')

        this.setState({
            stock: res.data.map(categoria => categoria),
            categoria: ''
        })
        //si se presenta un id en el params voy a actualizar y retorno los valores de ese id student
        if (this.props.match.params.id) {
            const res = await axios.get('http://localhost:8000/api/producto/' + this.props.match.params.id)
            this.setState({
                marca: res.data.marca,
                modelo: res.data.modelo,
                descripcion: res.data.descripcion,
                cantidad: res.data.cantidad,
                nroSerie: res.data.nroSerie,
                categoria: res.data.categoria.id,
                editing: true,
                id: this.props.match.params.id,
                titulo: 'Actualizar'
            })
        } else {
            this.setState({ titulo: 'Registrar' })
        }
    }


    //al enviar el form puedo hacer un post o put
    onSubmit = async (e) => {
        e.preventDefault();
        const newProducto = {
            marca: this.state.marca,
            modelo: this.state.modelo,
            descripcion: this.state.descripcion,
            cantidad: parseInt(this.state.cantidad),
            nroSerie: this.state.nroSerie,
            categoria: parseInt(this.state.categoria)
        };
        console.log(newProducto)
        if (this.state.editing) {
            await axios.put('http://localhost:8000/api/producto/' + this.state.id + '/', newProducto).then(res => {
                // do stuff
                swal({
                    text: 'Updated Producto',
                    icon: 'success'
                }).then(() => {
                    window.location.href = '/stock';
                })
            })
                .catch(err => {
                    // what now?
                    console.log(err);
                    swal({
                        text: 'The student exists or there is an empty field',
                        icon: 'error'
                    })
                })
        } else {

            //si editing esta en false hago un post
            await axios.post('http://localhost:8000/api/producto/', newProducto).then(res => {
                // do stuff
                console.log(res);
                swal({
                    text: 'Producto Created',
                    icon: 'success'
                }).then(() => {
                    window.location.href = '/producto';
                })
            })
                .catch(err => {
                    // what now?
                    console.log(err);
                    swal({
                        text: 'The Client exists or there is an empty field',
                        icon: 'warning'
                    })
                })
        }

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
                                        <h4>{this.state.titulo} Producto</h4>
                                        <div className="form-group">
                                            <select
                                                className="form-control"
                                                name="categoria"
                                                onChange={this.onInputChange}
                                                value={this.state.categoria}
                                            >
                                                <option value="">Selecciona Categoria</option>
                                                {
                                                    this.state.stock.map(categoria =>
                                                        <option key={categoria.id} value={categoria.id}>
                                                            {categoria.nombreCategoria}
                                                        </option>)
                                                }
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Marca Producto"
                                                name="marca"
                                                onChange={this.onInputChange}
                                                required
                                                value={this.state.marca}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Modelo Producto"
                                                name="modelo"
                                                onChange={this.onInputChange}
                                                required
                                                value={this.state.modelo}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Descripcion"
                                                name="descripcion"
                                                onChange={this.onInputChange}
                                                required
                                                value={this.state.descripcion}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Cantidad"
                                                name="cantidad"
                                                onChange={this.onInputChange}
                                                required
                                                value={this.state.cantidad}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Numero de Serie"
                                                name="nroSerie"
                                                onChange={this.onInputChange}
                                                required
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
