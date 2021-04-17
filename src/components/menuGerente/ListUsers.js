import React, { Component } from 'react'
import axios from 'axios'
import swal from 'sweetalert'
import Navigation from './Navigation'
import Cookies from 'universal-cookie'
import { Link } from 'react-router-dom'

const cookies = new Cookies()

export default class ListUsers extends Component {
    state = {
        users: [],
        tipoSelected: ''
    }
    async componentDidMount() {
        this.getUsers();
    }
    async getUsers() {
        const res = await axios.get('http://localhost:8000/api/users/');
        console.log(res)
        this.setState({
            users: res.data
        })
    }
    filter = async (tipo) => {
        if (tipo === '') {
            this.getUsers();
        } else {
            await axios.get('http://localhost:8000/api/users/?kind=' + tipo).then(res => {
                // do stuff
                console.log(res.data)
                this.setState({
                    users: res.data
                })
            }).catch(err => {
                // what now?
                console.log(err);
                swal({
                    text: 'No hay Users',
                    icon: 'error'
                })
            })
        }
    }
    deleteUser = async (id) => {
        await swal({
            title: 'Delete',
            text: 'Are you sure you want to delete the User?',
            icon: "warning",
            buttons: ['No', 'Yes']
        }).then(respuesta => {
            if (respuesta) {
                axios.delete('http://localhost:8000/api/users/' + id)

                swal({
                    text: 'User Deleted',
                    icon: 'success'
                }).then(() => {
                    this.getUsers()
                })
            }
        })
    }
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
                                            name="tipoSelected"
                                            onChange={this.onInputChange}
                                            onClick={() => this.filter(this.state.tipoSelected)}
                                        >
                                            <option value="">Select Tipo</option>
                                            <option value="A">Administrador</option>
                                            <option value="T">Técnico</option>
                                            <option value="G">Gerente</option>
                                        </select>
                                    </div>
                                    <table className="table table-light table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col">Name</th>
                                                <th scope="col">Email</th>
                                                <th scope="col">Tipo</th>
                                                <th scope="col">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.users.map(user => (
                                                    <tr key={user.id}>
                                                        <th>{user.name}</th>
                                                        <th>{user.email}</th>
                                                        <th>{user.kind}</th>
                                                        <th>
                                                            <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                                                <button
                                                                    className="btn btn-danger"
                                                                    onClick={() => this.deleteUser(user.id)}
                                                                >
                                                                    Delete
                                                                </button>
                                                                <Link className="btn btn-info" to={'/editUsers/' + user.id}>
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
