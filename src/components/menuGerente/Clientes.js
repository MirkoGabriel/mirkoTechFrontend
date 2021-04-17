import React, { Component } from 'react'
import axios from 'axios'
import swal from 'sweetalert'
import Navigation from './Navigation'
import Cookies from 'universal-cookie'
import { Link } from 'react-router-dom'

const cookies = new Cookies()

export default class Clientes extends Component {
    state = {
        nombre: '',
        telefono: '',
        email: '',
        pago: '',
        editing: false,
        id: '',
        titulo:'',
        contacto:'',
        domicilio:''
    }
    
    async componentDidMount() {
        
        //si se presenta un id en el params voy a actualizar y retorno los valores de ese id client
        if (this.props.match.params.id) {
            const res = await axios.get('http://localhost:8000/api/cliente/' + this.props.match.params.id)
            console.log(res)
            this.setState({
                nombre: res.data.nombre,
                telefono: res.data.telefono,
                email: res.data.email,
                pago: res.data.pago,
                editing: true,
                id: this.props.match.params.id,
                titulo:'Actualizar',
                contacto:res.data.contacto,
                domicilio:res.data.domicilio
            })
        }else{
            this.setState({titulo:'Registrar'})
        }
    }


    //al enviar el form puedo hacer un post o put
    onSubmit = async (e) => {
        e.preventDefault();
        const newCliente = {
            nombre: this.state.nombre,
            telefono: this.state.telefono,
            email: this.state.email,
            pago: this.state.pago,
            contacto:this.state.contacto,
            domicilio:this.state.domicilio
        };

        if (this.state.editing) {
            await axios.put('http://localhost:8000/api/cliente/' + this.state.id+'/', newCliente).then(res => {
                // do stuff
                console.log(res);
                swal({
                    text: 'Updated Client',
                    icon: 'success'
                }).then(() => {
                    window.location.href = '/listClientes';
                })
            })
                .catch(err => {
                    // what now?
                    console.log(err);
                    swal({
                        text: 'The Client exists or there is an empty field',
                        icon: 'error'
                    })
                })
        } else {

            //si editing esta en false hago un post
            await axios.post('http://localhost:8000/api/cliente/', newCliente).then(res => {
                // do stuff
                console.log(res);
                swal({
                    text: 'Client Created',
                    icon: 'success'
                }).then(() => {
                    window.location.href = '/clientes';
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
                                        <h4>{this.state.titulo} Cliente</h4>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Client Name"
                                                name="nombre"
                                                onChange={this.onInputChange}
                                                required
                                                value={this.state.nombre}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Contacto"
                                                name="contacto"
                                                onChange={this.onInputChange}
                                                required
                                                value={this.state.contacto}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Domicilio"
                                                name="domicilio"
                                                onChange={this.onInputChange}
                                                required
                                                value={this.state.domicilio}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Telefono"
                                                name="telefono"
                                                onChange={this.onInputChange}
                                                required
                                                value={this.state.telefono}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Email"
                                                name="email"
                                                onChange={this.onInputChange}
                                                required
                                                value={this.state.email}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <select
                                                className="form-control"
                                                name="pago"
                                                onChange={this.onInputChange}
                                                value={this.state.pago}
                                            >
                                                <option value="">Condición de Pago</option>
                                                <option value="Contado">Contado</option>
                                                <option value="30 Dias F.F">30 Dias F.F</option>
                                                <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                                            </select>
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
