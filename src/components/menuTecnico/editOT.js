import React, { Component } from 'react'
import axios from 'axios'
import swal from 'sweetalert'
import Navigation from './Navigation'
import Cookies from 'universal-cookie'
import { Link } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const cookies = new Cookies()

export default class editOT extends Component {
    state = {
        equipo: '',
        nroSerie: '',
        modelo: '',
        marca: '',
        fechaIngreso: '',
        clienteId: '',
        cliente: '',
        telefono: '',
        email: '',
        pago: '',
        opcion: '',
        flag: '',
        tecnicos: [],
        tecnicoSelected: '',
        id: '',
        estPresuSelected: '',
        estEquipSelected: '',
        datePresu: '',
        dateEqui: '',
        descripcion: '',
        /**tareas ot */
        categorias: [],
        categoriaSelected: '',
        productos: [],
        productoSelected: '',
        cantidadTarea: '',
        tareas: []
    }

    async componentDidMount() {
        this.getOT()
        this.getTecnicos()
    }

    async getOT() {
        const res = await axios.get('http://localhost:8000/api/ordenTrabajo/' + this.props.match.params.id)
        console.log(res.data)
        this.setState({
            fechaIngreso: res.data.fechaIngreso,
            clienteId: res.data.cliente.id,
            equipo: res.data.equipo,
            modelo: res.data.modelo,
            marca: res.data.marca,
            nroSerie: res.data.nroSerie,
            cliente: res.data.cliente.nombre,
            telefono: res.data.cliente.telefono,
            email: res.data.cliente.email,
            pago: res.data.cliente.pago,
            id: this.props.match.params.id,
            tecnicoSelected: res.data.tecnico.id,
            estEquipSelected: res.data.estadoEquipo,
            estPresuSelected: res.data.estadoPresupuesto,
            datePresu: res.data.fechaEstPresu === '' ? res.data.fechaEstPresu : new Date(res.data.fechaEstPresu),
            dateEqui: res.data.fechaEstEqui === '' ? res.data.fechaEstEqui : new Date(res.data.fechaEstEqui),
            descripcion: res.data.descripcion
        })
        console.log(this.state)
    }

    async getTareas() {
        await axios.get('http://localhost:8000/api/tareasOT/?ot=' + this.state.id).then(res => {
            // do stuff
            console.log(res.data)
            this.setState({
                tareas: res.data.map(tarea => tarea)
            })
        })
            .catch(err => {
                // what now?
                console.log(err);
                this.setState({
                    tarea: []
                })
            })
    }

    /*Obtengo la tarea la borro, cargad la cantidad y actualizo el stock*/
    devolverStock = async (id, cantidad, idPro) => {
        const res = await axios.get('http://localhost:8000/api/producto/' + idPro)
        console.log(res.data)
        const newProducto = {
            marca: res.data.marca,
            modelo: res.data.modelo,
            descripcion: res.data.descripcion,
            cantidad: parseInt(res.data.cantidad) + parseInt(cantidad),
            nroSerie: res.data.nroSerie,
            categoria: parseInt(res.data.categoria.id)
        }
        console.log(newProducto)

        await axios.put('http://localhost:8000/api/producto/' + idPro + '/', newProducto).then(res1 => {
            // do stuff

            axios.delete('http://localhost:8000/api/tareasOT/' + id + '/');
            swal({
                text: 'Updated Producto',
                icon: 'success'
            }).then(() => {
                window.location.href = '/editOT/' + this.state.id
            })
        })
            .catch(err => {
                // what now?
                console.log(err);
                swal({
                    text: 'Product no update',
                    icon: 'error'
                })
            })

    }

    async getCategoria() {
        const res = await axios.get('http://localhost:8000/api/stock/')
        this.setState({
            categorias: res.data.map(categoria => categoria)
        })
    }

    filtrarCat = async (categoria) => {
        if (categoria === '') {
            this.setState({
                productos: []
            })
        } else {
            await axios.get('http://localhost:8000/api/producto/?categoria=' + categoria).then(res => {
                // do stuff
                this.setState({
                    productos: res.data.map(producto => producto)
                })
            })
                .catch(err => {
                    // what now?
                    console.log(err);
                    this.setState({
                        productos: []
                    })
                    swal({
                        text: 'No hay productos en esta categoria',
                        icon: 'error'
                    })
                })
        }


    }

    /*obtiene los datos obtenidos ingresados, por el id de categoria obtengo datos 
    y los actualizo en stock e inserto en tareas OT*/
    actualizarStock = async (e) => {
        e.preventDefault()
        const res = await axios.get('http://localhost:8000/api/producto/' + (this.state.productoSelected))
        console.log(res.data)
        var cantidadStock = res.data.cantidad
        if (cantidadStock >= parseInt(this.state.cantidadTarea)) {
            const newProducto = {
                marca: res.data.marca,
                modelo: res.data.modelo,
                descripcion: res.data.descripcion,
                cantidad: parseInt(res.data.cantidad) - parseInt(this.state.cantidadTarea),
                nroSerie: res.data.nroSerie,
                categoria: parseInt(res.data.categoria.id)
            }
            await axios.put('http://localhost:8000/api/producto/' + this.state.productoSelected + '/', newProducto).then(res1 => {
                // do stuff
                swal({
                    text: 'Updated Producto',
                    icon: 'success'
                })
            })
                .catch(err => {
                    // what now?
                    console.log(err);
                    swal({
                        text: 'Product no update',
                        icon: 'error'
                    })
                })
            const tareaOT = {
                ot: parseInt(this.state.id),
                categoria: this.state.categoriaSelected,
                producto: res.data.modelo,
                cantidad: parseInt(this.state.cantidadTarea),
                idProducto: parseInt(res.data.id)
            }
            await axios.post('http://localhost:8000/api/tareasOT/', tareaOT).then(res => {
                // do stuff
                console.log(res);
                swal({
                    text: 'Tarea Cargada',
                    icon: 'success'
                }).then(() => {
                    window.location.href = '/editOT/' + this.state.id
                })
            })
                .catch(err => {
                    // what now?
                    console.log(err);
                    swal({
                        text: 'Tarea no cargada',
                        icon: 'warning'
                    })
                })
            console.log(tareaOT)
            console.log(newProducto)
        } else {
            console.log("no hay repuestos disponibles")
        }

    }

    async getTecnicos() {
        await axios.get('http://localhost:8000/api/users/?kind=T').then(res => {
            // do stuff
            this.setState({ tecnicos: res.data.map(tecnico => tecnico) })
        })
            .catch(err => {
                // what now?
                console.log(err);
                this.setState({
                    tarea: []
                })
            })
    }

    buscar = (opcion) => {
        console.log(opcion)
        if (opcion === 'default') {
            this.setState({ flag: null })
        } else if (opcion === 'cargarR') {
            this.setState({ flag: 1 })
            this.getCategoria()
        } else if (opcion === 'mostrarR') {
            this.setState({ flag: 2 })
            this.getTareas()
        }
    }
    onInputChange = e => {

        console.log(e.target.name, e.target.value)
        this.setState({
            [e.target.name]: e.target.value

        })
    }
    onChangeDate = dateEqui => {
        this.setState({ dateEqui })
    }

    onChangeDate1 = datePresu => {
        this.setState({ datePresu })
    }
    onSubmit = async (e) => {
        e.preventDefault();
        if (this.state.dateEqui === null || this.state.datePresu === null) {
            swal({
                text: 'Si vas a actualizar carga el estado de equipo y prespuesto',
                icon: 'warning'
            })
        } else {

            const newOT = {
                cliente: this.state.clienteId,
                equipo: this.state.equipo,
                fechaIngreso: this.state.fechaIngreso,
                marca: this.state.marca,
                modelo: this.state.modelo,
                nroSerie: this.state.nroSerie,
                tecnico: parseInt(this.state.tecnicoSelected),
                estadoEquipo: this.state.estEquipSelected,
                estadoPresupuesto: this.state.estPresuSelected,
                fechaEstEqui: this.state.dateEqui.toDateString(),
                fechaEstPresu: this.state.datePresu.toDateString(),
                descripcion: this.state.descripcion
            }
            if (this.state.descripcion === '') {
                newOT.descripcion = null
            }
            await axios.put('http://localhost:8000/api/ordenTrabajo/' + parseInt(this.state.id) + '/', newOT).then(res => {
                // do stuff
                console.log(res);
                swal({
                    text: 'Updated OT',
                    icon: 'success'
                }).then(() => {
                    window.location.href = '/seguimiento';
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
        }
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
                                    <div className="col-md-12 p-6">
                                        <div className="card">
                                            {/* OT*/}
                                            <div className="card-header">
                                                <div className="row justify-content-between">
                                                    <div className="col-sm-4">
                                                        <h3>OT N° {this.props.match.params.id}</h3>
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <select
                                                            className="form-control"
                                                            name="tecnicoSelected"
                                                            onChange={this.onInputChange}
                                                            value={this.state.tecnicoSelected}
                                                        >
                                                            <option value="default">Seleccionar Técnico</option>
                                                            {
                                                                this.state.tecnicos.map(tecnico =>
                                                                    <option key={tecnico.id} value={tecnico.id}>
                                                                        {tecnico.name}
                                                                    </option>)
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* DETALLE OT*/}
                                            <div className="card-body">
                                                <div className="row justify-content-between">
                                                    <div className="col-sm-3">
                                                        <div className="alert alert-light text-center">
                                                            <h5>Cliente</h5>
                                                            <p>{this.state.cliente}</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <div className="alert alert-light text-center">
                                                            <h5>Teléfono</h5>
                                                            <p>{this.state.telefono}</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <div className="alert alert-light text-center">
                                                            <h5>Email</h5>
                                                            <p>{this.state.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <div className="alert alert-light text-center">
                                                            <h5>Condición Pago</h5>
                                                            <p>{this.state.pago}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row justify-content-between">
                                                    <div className="col-sm-3">
                                                        <div className="alert alert-light text-center">
                                                            <h5>Equipo</h5>
                                                            <p>{this.state.equipo}</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <div className="alert alert-light text-center">
                                                            <h5>Marca</h5>
                                                            <p>{this.state.marca}</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <div className="alert alert-light text-center">
                                                            <h5>Modelo</h5>
                                                            <p>{this.state.modelo}</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <div className="alert alert-light text-center">
                                                            <h5>Número Serie</h5>
                                                            <p>{this.state.nroSerie}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* TAREAS REALIZADAS*/}
                                            <div className="card-header text-center">
                                                <h5>Detalle de Tareas</h5>
                                            </div>
                                            <div className="card-body">
                                                <div className="container">

                                                    <div className="form-group">
                                                        <div className="row align-items-center">
                                                            <div className="col-3">
                                                                <select
                                                                    className="form-control"
                                                                    name="opcion"
                                                                    onChange={this.onInputChange}
                                                                    onClick={() => this.buscar(this.state.opcion)}
                                                                >
                                                                    <option value="default">Seleccionar Accion</option>
                                                                    <option value="cargarR">Cargar Repuestos</option>
                                                                    <option value="mostrarR">Mostrar Repuestos</option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                    </div>

                                                    {(() => {
                                                        if (this.state.flag === 1) {
                                                            return (
                                                                <div className="row align-items-center">
                                                                    <div className="col-3">
                                                                        <select
                                                                            className="form-control"
                                                                            name="categoriaSelected"
                                                                            onChange={this.onInputChange}
                                                                            onClick={() => this.filtrarCat(this.state.categoriaSelected)}
                                                                        >
                                                                            <option value="">Select Categoria</option>
                                                                            {
                                                                                this.state.categorias.map(categoria =>
                                                                                    <option key={categoria.nombreCategoria} value={categoria.nombreCategoria}>
                                                                                        {categoria.nombreCategoria}
                                                                                    </option>)
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <select
                                                                            className="form-control"
                                                                            name="productoSelected"
                                                                            onChange={this.onInputChange}
                                                                        >
                                                                            <option value="">Select Producto</option>
                                                                            {
                                                                                this.state.productos.map(producto =>
                                                                                    <option key={producto.id} value={producto.id}>
                                                                                        {producto.modelo}
                                                                                    </option>)
                                                                            }
                                                                        </select>
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder="Cantidad"
                                                                            name="cantidadTarea"
                                                                            onChange={this.onInputChange}
                                                                            required
                                                                            value={this.state.cantidadTarea}
                                                                        />
                                                                    </div>
                                                                    <div className="col-3">
                                                                        <form onSubmit={this.actualizarStock}>
                                                                            <button
                                                                                className="btn btn-outline-secondary"
                                                                            >
                                                                                Cargar
                                                                        </button>
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            )
                                                        } else if (this.state.flag === 2) {
                                                            return (
                                                                <table className="table">
                                                                    <thead>
                                                                        <tr>
                                                                            <th scope="col">Repuesto</th>
                                                                            <th scope="col">Marca</th>
                                                                            <th scope="col">Cantidad</th>
                                                                            <th scope="col">Actions</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {
                                                                            this.state.tareas.map(tarea => (
                                                                                <tr key={tarea.id}>
                                                                                    <th>{tarea.categoria}</th>
                                                                                    <th>{tarea.producto}</th>
                                                                                    <th>{tarea.cantidad}</th>
                                                                                    <th>
                                                                                        <button
                                                                                            className="btn btn-outline-danger"
                                                                                            onClick={() => this.devolverStock(tarea.id, tarea.cantidad, tarea.idProducto)}>

                                                                                            Devolver
                                                                                        </button>
                                                                                    </th>
                                                                                </tr>
                                                                            ))
                                                                        }
                                                                    </tbody>
                                                                </table>
                                                            )
                                                        }
                                                    })()}
                                                </div>
                                            </div>

                                            {/* EQUIPO PRESUPUESTO*/}

                                            <div className="card-header text-center">
                                                <div className="row">
                                                    <div className="col-6">
                                                        <h5>Estado Equipo</h5>
                                                    </div>
                                                    <div className="col-6">
                                                        <h5>Estado Presupuesto</h5>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <div className="row justify-content-between">
                                                    <div className="col-sm-3">
                                                        <div className="alert alert-light text-center">
                                                            <h5>Estado Equipo</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <div className="alert alert-light text-center">
                                                            <select
                                                                className="form-control"
                                                                name="estEquipSelected"
                                                                onChange={this.onInputChange}
                                                                value={this.state.estEquipSelected}
                                                            >
                                                                <option value="">Seleccionar Estado</option>
                                                                <option value="A revisar">A revisar</option>
                                                                <option value="Revisado">Revisado</option>
                                                                <option value="Demorado">Demorado</option>
                                                                <option value="Aprobado">Aprobado</option>
                                                                <option value="Reparado">Reparado</option>
                                                                <option value="No Reparado">No Reparado</option>
                                                                <option value="Entregado">Entregado</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <div className="alert alert-light text-center">
                                                            <h5>Estado Presupuesto</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <div className="alert alert-light text-center">
                                                            <select
                                                                className="form-control"
                                                                name="estPresuSelected"
                                                                onChange={this.onInputChange}
                                                                value={this.state.estPresuSelected}
                                                            >
                                                                <option value="">Seleccionar Estado</option>
                                                                <option value="A revisar">A revisar</option>
                                                                <option value="Presupuestado">Presupuestado</option>
                                                                <option value="Demorado">Rechazado</option>
                                                                <option value="Aprobado">Aprobado</option>
                                                                <option value="Avisado">Avisado</option>
                                                                <option value="Irreparable">Irreparable</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row justify-content-between">
                                                    <div className="col-sm-3">
                                                        <div className="alert alert-light text-center">
                                                            <h5>Fecha Equipo</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <div className="alert alert-light text-center">
                                                            <DatePicker
                                                                selected={this.state.dateEqui}
                                                                onChange={this.onChangeDate}
                                                                dateFormat="dd/MM/yyyy"
                                                                placeholderText="Fecha Equipo"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <div className="alert alert-light text-center">
                                                            <h5>Fecha Presupuesto</h5>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <div className="alert alert-light text-center">
                                                            <DatePicker
                                                                selected={this.state.datePresu}
                                                                onChange={this.onChangeDate1}
                                                                dateFormat="dd/MM/yyyy"
                                                                placeholderText="Fecha Presupuesto"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* DETALLE TAREAS */}
                                            <div className="card-header text-center">
                                                <h5>Detalle de Tareas</h5>
                                            </div>
                                            <div className="card-body">
                                                <textarea
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Tareas Realizadas"
                                                    name="descripcion"
                                                    onChange={this.onInputChange}
                                                    value={this.state.descripcion}
                                                />
                                            </div>

                                            {/* ACCIONES */}
                                            <div className="card-footer">
                                                <div className="row justify-content-between">
                                                    <div className="col-sm-4">
                                                    </div>
                                                    <div className="col-sm-2">

                                                        <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                                            <form onSubmit={this.onSubmit}>
                                                                <button type="submit" className="btn btn-info btn-lg">
                                                                    Save
                                                                </button>
                                                            </form>
                                                            <Link className="btn btn-danger btn-lg" to="/seguimiento" >Exit</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
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
