import React, { Component } from 'react'
import axios from 'axios'
import swal from 'sweetalert'
import Navigation from './Navigation'
import Cookies from 'universal-cookie'
import { Link } from 'react-router-dom'

const cookies = new Cookies()

export default class Stock extends Component {
    state = {
        productos: [],
        productosAux: [],
        stock: [],
        categoria: ''
    }
    //carga en el array stock las categorias definido en el estado los grupos y ponerlos en el select para filtrar
    async componentDidMount() {
        this.getProductos();

        const res = await axios.get('http://localhost:8000/api/stock/')
        this.setState({
            stock: res.data.map(categoria => categoria),
            categoria: ''
        })
    }

    //filtra productos por la categoria mandada
    filter =  (categoria) => {
        if (categoria === '') {
            this.getProductos();
        } else {
            const res = this.state.productosAux.filter(pos => pos.categoria.id === parseInt(categoria))

            if (res.length === 0) {
                swal({
                    title: 'Error',
                    text: 'There are no models in this marca',
                    icon: "warning"
                }).then(() => {
                    window.location.href = '/stockTecnico'
                })
            } else {
                this.setState({ productos: res })
            }
        }
    }
    //obtiene de la bbdd todas los productos
    async getProductos() {
        const res = await axios.get('http://localhost:8000/api/producto/');
        this.setState({
            productos: res.data.slice(0, 10),
            productosAux: res.data
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
                if (cookies.get('kind') === 'T' || cookies.get('kind') === 'G') {
                    return (
                        <div>
                            <Navigation />
                            <div className="container p-4">
                                <div className="row">
                                    <div className="form-group">
                                        <select
                                            className="form-control"
                                            name="categoria"
                                            onChange={this.onInputChange}
                                            onClick={() => this.filter(this.state.categoria)}
                                        >
                                            <option value="">Select Categoria</option>
                                            {
                                                this.state.stock.map(categoria =>
                                                    <option key={categoria.id} value={categoria.id}>
                                                        {categoria.nombreCategoria}
                                                    </option>)
                                            }
                                        </select>
                                    </div>
                                    <table className="table table-light table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col">Categoria</th>
                                                <th scope="col">Marca</th>
                                                <th scope="col">Modelo</th>
                                                <th scope="col">Descripción</th>
                                                <th scope="col">Número de Serie</th>
                                                <th scope="col">Cantidad</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.productos.map(producto => (
                                                    <tr key={producto.id}>
                                                        <th>{producto.categoria.nombreCategoria}</th>
                                                        <th>{producto.marca}</th>
                                                        <th>{producto.modelo}</th>
                                                        <th>{producto.descripcion}</th>
                                                        <th>{producto.nroSerie}</th>
                                                        <th>{producto.cantidad}</th>
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
