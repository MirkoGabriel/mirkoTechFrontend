import React, { Component } from 'react'
import axios from 'axios'
import swal from 'sweetalert'
import Navigation from './Navigation'
import Cookies from 'universal-cookie'
import { Link } from 'react-router-dom'
import logo from '../../icons/mirkoTech.png'
import a from '../../icons/remito.png'
import linea from '../../icons/linea.png'
import lineav from '../../icons/lineav.png'
import jsPDF from 'jspdf'

const cookies = new Cookies()

export default class Remito extends Component {
    state = {
        idAdministrador: '',
        OT: '',
        descripcion: '',
        idCliente: '',
        nombreCliente: '',
        emailCliente: '',
        telefonoCliente: '',
        pagoCliente: '',
        fecha: '',
        admins: [],
        adminSelected: '',
        nroRemito: '',
        informacion: '',
        flag: null,
        editing: false,
        domicilioCliente: '',
        contactoCliente: '',
        tipoEquipo:'',
        marcaEquipo:'',
        modeloEquipo:'',
        nroSerie:''
    }

    async componentDidMount() {
        const res = await axios.get('http://localhost:8000/api/users/?kind=A');
        console.log(res.data)
        this.setState({
            admins: res.data.map(admin => admin),
            adminSelected: ''
        })
        if (this.props.match.params.id) {
            const res = await axios.get('http://localhost:8000/api/remito/' + this.props.match.params.id)
            console.log(res.data)
            this.setState({
                flag: true,
                nroRemito: res.data.id,
                adminSelected: res.data.administrador.id,
                informacion: res.data.informacion,
                descripcion: res.data.descripcion,
                OT: res.data.oti.id,
                tipoEquipo:res.data.oti.equipo,
                marcaEquipo:res.data.oti.marca,
                modeloEquipo:res.data.oti.modelo,
                nroSerie:res.data.oti.nroSerie,
                idCliente: res.data.oti.cliente.id,
                nombreCliente: res.data.oti.cliente.nombre,
                emailCliente: res.data.oti.cliente.email,
                telefonoCliente: res.data.oti.cliente.telefono,
                pagoCliente: res.data.oti.cliente.pago,
                contactoCliente: res.data.oti.cliente.contacto,
                domicilioCliente: res.data.oti.cliente.domicilio,
                fecha: res.data.fechaIngreso.substr(0, 10),
                editing: true
            })
        }
    }

    onSubmit = async (e) => {
        e.preventDefault();
        const newRemito = {
            oti: parseInt(this.state.OT),
            administrador: parseInt(this.state.adminSelected),
            informacion: this.state.informacion,
            descripcion: this.state.descripcion
        }

        if (this.state.editing) {
            console.log(newRemito)
            await axios.put('http://localhost:8000/api/remito/' + parseInt(this.state.nroRemito) + '/', newRemito).then(res => {
                // do stuff
                console.log(res);
                swal({
                    title: 'Remito Ingresado',
                    text: 'Desea imprimir ?',
                    icon: "success",
                    buttons: ['No', 'Si']
                }).then(respuesta => {
                    if (respuesta) {
                        this.setState({
                            fecha: res.data.fechaIngreso.substr(0, 10),
                            nroRemito: res.data.id,
                            flag: true
                        })
                        window.print()
                        window.location.href = '/listRemito';
                    } else {
                        window.location.href = '/listRemito';
                    }
                })
            })
                .catch(err => {
                    // what now?
                    console.log(err);
                    swal({
                        title: 'Error',
                        text: 'Empty fields',
                        icon: "warning"
                    })
                })
        } else {
            await axios.post('http://localhost:8000/api/remito/', newRemito).then(res => {
                // do stuff

                console.log(res)
                swal({
                    title: 'Remito Ingresada',
                    text: 'Desea imprimir ?',
                    icon: "success",
                    buttons: ['No', 'Si']
                }).then(respuesta => {
                    if (respuesta) {
                        this.setState({
                            fecha: res.data.fechaIngreso.substr(0, 10),
                            nroRemito: res.data.id
                        })
                        this.print()
                        window.location.href = '/menuAdministrador';
                    } else {
                        window.location.href = '/menuAdministrador';
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
    }

    buscar = async (id) => {
        console.log(id)
        await axios.get('http://localhost:8000/api/ordenTrabajo/' + id).then(res => {
            // do stuff
            console.log(res.data)
            if (res.data.estadoEquipo === 'Entregado') {
                this.setState({
                    idCliente: res.data.cliente.id,
                    nombreCliente: res.data.cliente.nombre,
                    emailCliente: res.data.cliente.email,
                    telefonoCliente: res.data.cliente.telefono,
                    pagoCliente: res.data.cliente.pago,
                    contactoCliente: res.data.cliente.contacto,
                    domicilioCliente: res.data.cliente.domicilio
                })
            } else {
                swal({
                    title: 'Error',
                    text: 'La OT Tiene que estar como "Entregado"',
                    icon: "error"
                })
                this.setState({
                    OT: '',
                    idCliente: '',
                    nombreCliente: '',
                    emailCliente: '',
                    telefonoCliente: '',
                    pagoCliente: ''
                })
            }

        }).catch(err => {
            // what now?
            swal({
                title: 'Error',
                text: 'No Existe la OT',
                icon: "error"
            })
            this.setState({
                OT: '',
                idCliente: '',
                nombreCliente: '',
                emailCliente: '',
                telefonoCliente: '',
                pagoCliente: ''
            })
        })

    }

    onInputChange = e => {
        console.log(e.target.name, e.target.value)
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    print() {
        var doc = new jsPDF()
        doc.addImage(logo,'PNG',32,10,35,35)
        doc.addImage(a,'PNG',90,5,30,60)
        doc.addImage(linea,'PNG',0,58,400,10)
        doc.addImage(linea,'PNG',0,70.1,400,10)
        doc.addImage(linea,'PNG',0,98,400,10)
        doc.addImage(linea,'PNG',0,110,400,10)
        doc.addImage(linea,'PNG',0,130,400,10)
        doc.addImage(linea,'PNG',0,142,400,10)
        doc.addImage(linea,'PNG',0,262,400,10)
        doc.addImage(lineav,'PNG',75,135,10,132)

        doc.text(35,50,'Mirko Tech')
        doc.text(32,55,'Reparaciones')
        doc.text(120,20,'Remito')
        doc.text(120,30,'N° 0001-'+this.state.nroRemito)
        doc.text(120,40,'Fecha de emisión :  '+this.state.fecha )
        doc.text(120,50,'CUIL :  20-93873483-7')

        doc.text(20,70,'DATOS DEL CLIENTE')
        doc.text(20,82,'Razón Social: '+this.state.nombreCliente)
        doc.text(100,82,'Contacto: '+this.state.contactoCliente)
        doc.text(20,90,'Telefono: '+this.state.telefonoCliente)
        doc.text(100,90,'Domicilio: '+this.state.domicilioCliente)
        doc.text(20,98,'Pago: '+this.state.pagoCliente)
        doc.text(100,98,'Email: '+this.state.emailCliente)

        doc.text(20,110,'DATOS DEL EQUIPO')
        doc.text(20,122,'Tipo: '+this.state.tipoEquipo)
        doc.text(100,122,'Marca: '+this.state.marcaEquipo)
        doc.text(20,130,'Modelo: '+this.state.modeloEquipo)
        doc.text(100,130,'Número de Serie: '+this.state.nroSerie)

        doc.text(20,142,'Orden Trabajo')
        doc.text(35,155,''+this.state.OT)

        doc.text(100,142,'Descripción')
        doc.text(100,155,''+this.state.descripcion)
        doc.text(100,163,''+this.state.informacion)

        doc.text(100,290,'Recibí conforme: ......................................')

        doc.save('Remito_0002-'+this.state.nroRemito+'.pdf')
    }

    render() {
        return (
            (() => {
                if (cookies.get('kind') === 'A' || cookies.get('kind') === 'G') {
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
                                                        {(() => {
                                                            if (this.state.flag === true) {
                                                                return (
                                                                    <h3>Remito N° {this.state.nroRemito}</h3>
                                                                )
                                                            } else {
                                                                return (
                                                                    <h3>Cargar Nuevo Remito</h3>
                                                                )
                                                            }
                                                        })()}
                                                    </div>
                                                    <div className="col-sm-3">
                                                        <div className="form-group">
                                                            <select
                                                                className="form-control"
                                                                name="adminSelected"
                                                                onChange={this.onInputChange}
                                                                value={this.state.adminSelected}
                                                            >
                                                                <option value="">Select Admin</option>
                                                                {
                                                                    this.state.admins.map(admin =>
                                                                        <option key={admin.id} value={admin.id}>
                                                                            {admin.name}
                                                                        </option>)
                                                                }
                                                            </select>
                                                        </div>
                                                        <div className="form-group">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                name="fecha"
                                                                required
                                                                value={this.state.fecha}
                                                                readOnly="readonly"
                                                                placeholder="Fecha Ingreso"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-6">



                                                        <div className="form-group">
                                                            <div className="col-10">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="nombreCliente"
                                                                    required
                                                                    value={this.state.nombreCliente}
                                                                    readOnly="readonly"
                                                                    placeholder="Nombre de Cliente"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <div className="col-10">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="contactoCliente"
                                                                    required
                                                                    value={this.state.contactoCliente}
                                                                    readOnly="readonly"
                                                                    placeholder="Contacto de Cliente"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <div className="col-10">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="emailCliente"
                                                                    required
                                                                    value={this.state.emailCliente}
                                                                    readOnly="readonly"
                                                                    placeholder="Email de Cliente"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <div className="col-10">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="telefonoCliente"
                                                                    required
                                                                    value={this.state.telefonoCliente}
                                                                    readOnly="readonly"
                                                                    placeholder="Teléfono de Cliente"
                                                                />
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="col-6">
                                                        <div className="form-group">
                                                            <div className="col-10">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="pagoCliente"
                                                                    required
                                                                    value={this.state.pagoCliente}
                                                                    readOnly="readonly"
                                                                    placeholder="Condiciones Comerciales"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <div className="col-10">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="domicilioCliente"
                                                                    required
                                                                    value={this.state.domicilioCliente}
                                                                    readOnly="readonly"
                                                                    placeholder="Domicilio Cliente"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="form-group">
                                                            <div className="col-12">
                                                                <textarea
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Informacón de Entrega"
                                                                    name="informacion"
                                                                    onChange={this.onInputChange}
                                                                    value={this.state.informacion}
                                                                    cols="40"
                                                                    rows="3"
                                                                />
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/*OT */}
                                            <div className="card-header text-center">
                                                <h5>Detalle de Tareas</h5>
                                            </div>
                                            <div className="card-body">
                                                <div className="container">
                                                    <table className="table">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">Orden de Trabajo</th>
                                                                <th scope="col">Descripción</th>
                                                                <th scope="col">Accion</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <th scope="col">
                                                                    <div className="form-group">
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder="Número de OT"
                                                                            name="OT"
                                                                            onChange={this.onInputChange}
                                                                            required
                                                                            value={this.state.OT}
                                                                        />
                                                                    </div>
                                                                </th>
                                                                <th scope="col">
                                                                    <div className="form-group">
                                                                        <textarea
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder="Descripción"
                                                                            name="descripcion"
                                                                            onChange={this.onInputChange}
                                                                            value={this.state.descripcion}
                                                                            rows="1"
                                                                        />
                                                                    </div>
                                                                </th>
                                                                <th scope="col">
                                                                    <button
                                                                        className="btn btn-info"
                                                                        onClick={() => this.buscar(this.state.OT)}
                                                                    >
                                                                        Buscar
                                                                    </button>
                                                                </th>
                                                            </tr>
                                                        </tbody>
                                                    </table>


                                                </div>
                                            </div>
                                            {/* ACCIONES */}
                                            <div className="card-footer">
                                                <div className="row justify-content-between">
                                                    <div className="col-sm-4">
                                                        {(() => {
                                                            if (this.state.editing === true) {
                                                                return (
                                                                    <button type="submit" className="btn btn-info btn-lg" onClick={() => this.print()}>
                                                                        Imprimir
                                                                    </button>
                                                                )
                                                            }
                                                        })()}
                                                    </div>
                                                    <div className="col-sm-2">

                                                        <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                                            <form onSubmit={this.onSubmit}>
                                                                <button type="submit" className="btn btn-info btn-lg">
                                                                    Save
                                                                </button>
                                                            </form>

                                                            <Link className="btn btn-danger btn-lg" to="/listRemito" >Exit</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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
