import React, { Component } from 'react'
import axios from 'axios'
import swal from 'sweetalert'
import Navigation from './menuGerente/Navigation'
import { Link } from 'react-router-dom'
import Cookies from 'universal-cookie'

const cookies = new Cookies()

export default class Registrar extends Component {
    state = {
        name: '',
        password: '',
        tipo: '',
        email: '',
        editing: false,
        title: ''
    }
    /**  Uso el mismo componente para actualizar datos de usuario con 
     * esto traigo los datos del backend y los pinto en el form
    */
    async componentDidMount() {
        if (this.props.match.params.id) {
            const res = await axios.get('http://localhost:8000/api/users/' + this.props.match.params.id)
            console.log(res.data)
            this.setState({
                name: res.data.name,
                password: res.data.password,
                email: res.data.email,
                tipo: res.data.kind,
                editing: true,
                id: this.props.match.params.id,
                title: 'Actualizar'
            })
        } else {
            this.setState({ title: 'New' })
        }
    }
    onInputChange = e => {
        console.log(e.target.name, e.target.value)
        this.setState({
            [e.target.name]: e.target.value

        })
    }
    onSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            name: this.state.name,
            kind: this.state.tipo,
            email: this.state.email,
            password: this.state.password
        };
        console.log(newUser)
        if (this.state.editing) {
            await axios.put('http://localhost:8000/api/users/' + this.state.id + '/', newUser).then(res => {
                console.log(res);
                swal({
                    text: 'Updated User',
                    icon: 'success'
                }).then(() => {
                    window.location.href = '/listUsers';
                })
            }).catch(err => {
                    console.log(err);
                    swal({
                        text: 'The user exists or there is an empty field',
                        icon: 'error'
                    })
                })
        } else {
            await axios.post('http://localhost:8000/api/users/', newUser).then(res => {
                console.log(res);
                swal({
                    text: 'User Created',
                    icon: 'success'
                }).then(() => {
                    window.location.href = '/createUsers';
                })
            }).catch(err => {
                console.log(err);
                swal({
                    text: 'The User exists or there is an empty field',
                    icon: 'warning'
                })
            })
        }

    }
    render() {
        return ((() => {
            if (cookies.get('kind') === 'G') {
                return (
                    <div>
                        <Navigation />
                        <div className="container p-4">
                            <div className="row justify-content-center pt-4 mt-4 mr-1">
                                <div className="col-md-3 formulario">
                                    <div className="card card-body">
                                        <div className="form-group text-center">
                                            <h4>{this.state.title} User</h4>
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Name"
                                                onChange={this.onInputChange}
                                                name="name"
                                                value={this.state.name}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Email"
                                                onChange={this.onInputChange}
                                                name="email"
                                                value={this.state.email}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Password"
                                                onChange={this.onInputChange}
                                                name="password"
                                                value={this.state.password}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <select
                                                className="form-control"
                                                name="tipo"
                                                onChange={this.onInputChange}
                                                value={this.state.tipo}
                                            >
                                                <option value="">Seleccionar Tipo</option>
                                                <option value="A">Administrador</option>
                                                <option value="T">Técnico</option>
                                                <option value="G">Gerente</option>
                                            </select>
                                        </div>
                                        <div className="form-group text-center">
                                            <form onSubmit={this.onSubmit}>
                                                <button type="submit" className="btn btn-primary btn-sm btn-block">
                                                    Save
                                        </button>
                                            </form>
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
                                        <h4>New User</h4>
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Name"
                                            onChange={this.onInputChange}
                                            name="name"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Email"
                                            onChange={this.onInputChange}
                                            name="email"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="password"
                                            className="form-control"
                                            placeholder="Password"
                                            onChange={this.onInputChange}
                                            name="password"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <select
                                            className="form-control"
                                            name="tipo"
                                            onChange={this.onInputChange}
                                        >
                                            <option value="default">Seleccionar Tipo</option>
                                            <option value="A">Administrador</option>
                                            <option value="T">Técnico</option>
                                        </select>
                                    </div>
                                    <div className="form-group text-center">
                                        <form onSubmit={this.onSubmit}>
                                            <button type="submit" className="btn btn-secondary btn-sm btn-block">
                                                Create
                                        </button>
                                        </form>
                                    </div>
                                    <div className="form-group text-center">
                                        <Link className="btn btn-secondary btn-sm btn-block" to="/">Home</Link>
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
