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
        stock: [],
        categoria: ''
    }
    //carga en el arraystock categorias para filtrar los productos
    async componentDidMount() {
        this.getProductos();

        const res = await axios.get('http://localhost:8000/api/stock/')
        this.setState({
            stock: res.data.map(categoria => categoria),
            categoria: ''
        })
    }

    //filtrar productos por categoria
    filter = async (categoria) => {
        console.log(categoria)
        if (categoria === '') {
            this.getProductos()
        } else {
            await axios.get('http://localhost:8000/api/producto/?idCat=' + parseInt(categoria)).then(res => {
                // do stuff
                console.log(res.data)
                this.setState({
                    productos: res.data
                })
            }).catch(err => {
                // what now?
                console.log(err);
                swal({
                    text: 'No hay productos',
                    icon: 'error'
                })
            })
        }
    }
    //obtiene de la bbdd los productos
    async getProductos() {
        const res = await axios.get('http://localhost:8000/api/producto/');
        this.setState({
            productos: res.data
        })
    }

    // de la accion one click llama a esta funcion mandando el id de la producto seleccionada y la borra
    deleteProducto = async (id) => {
        await swal({
            title: 'Delete',
            text: 'Are you sure you want to delete the Product?',
            icon: "warning",
            buttons: ['No', 'Yes']
        }).then(respuesta => {
            if (respuesta) {
                axios.delete('http://localhost:8000/api/producto/' + id)

                swal({
                    text: 'Producto Deleted',
                    icon: 'success'
                }).then(() => {
                    this.getProductos()
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
                                                <th scope="col">Descripci??n</th>
                                                <th scope="col">N??mero de Serie</th>
                                                <th scope="col">Cantidad</th>
                                                <th scope="col">Actions</th>
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
                                                        <th>
                                                            <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                                                <button
                                                                    className="btn btn-danger"
                                                                    onClick={() => this.deleteProducto(producto.id)}
                                                                >
                                                                    Delete
                                                                </button>
                                                                <Link className="btn btn-info" to={'/editProducto/' + producto.id}>
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
