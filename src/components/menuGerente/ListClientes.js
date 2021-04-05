import React, { Component } from 'react'
import axios from 'axios'
import swal from 'sweetalert'
import Navigation from './Navigation'
import Cookies from 'universal-cookie'
import { Link } from 'react-router-dom'

const cookies = new Cookies()

export default class ListClientes extends Component {
    state = {
        clientes: [],
        clientesAux: []
    }
    //carga en el arrayGroup definido en el estado los grupos y ponerlos en el select para filtrar
    async componentDidMount() {
        this.getClientes();
    }

    //filtrar materias por group CAMBIAR!!!!
    filter = async (group) => {
        if (group === '') {
            this.getSubjects();
        } else {
            const res1 = this.state.subjectsAux.find(pos => pos.group === null)
            if (res1) {
                alert('Error')
                const res = this.state.subjectsAux.filter(pos => pos.group === null)

                this.setState({ subjects: res })
            } else {
                const res = this.state.subjectsAux.filter(pos => pos.group._id === group && pos.group !== null)

                if (res.length === 0) {
                    swal({
                        title: 'Error',
                        text: 'There are no subjects in this group',
                        icon: "warning"
                    }).then(() => {
                        window.location.href = 'listSubject'
                    })
                } else {
                    this.setState({ subjects: res })
                }

            }
        }
    }
    //obtiene de la bbdd todas las meterias
    async getClientes() {
        const res = await axios.get('http://localhost:8000/api/cliente/');
        this.setState({
            clientes: res.data.slice(0, 10),
            clientesAux: res.data
        })
    }

    // de la accion one click llama a esta funcion mandando el id de la materia seleccionada y la borra
    deleteCliente = async (id) => {
        await swal({
            title: 'Delete',
            text: 'Are you sure you want to delete the client?',
            icon: "warning",
            buttons: ['No', 'Yes']
        }).then(respuesta => {
            if (respuesta) {
                axios.delete('http://localhost:8000/api/cliente/' + id)

                swal({
                    text: 'Cliente Deleted',
                    icon: 'success'
                }).then(() => {
                    this.getClientes()
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
                                        >
                                            <option value="">Selecciona Letra</option>
                                            <option value="">A</option>
                                            <option value="">B</option>
                                            <option value="">C</option>
                                            <option value="">D</option>
                                            <option value="">E</option>
                                            <option value="">F</option>
                                            <option value="">G</option>
                                            <option value="">H</option>
                                            <option value="">I</option>
                                            <option value="">J</option>
                                            <option value="">K</option>
                                            <option value="">L</option>
                                            <option value="">M</option>
                                            <option value="">N</option>
                                            <option value="">Ñ</option>
                                            <option value="">O</option>
                                            <option value="">P</option>
                                            <option value="">Q</option>
                                            <option value="">R</option>
                                            <option value="">S</option>
                                            <option value="">T</option>
                                            <option value="">U</option>
                                            <option value="">V</option>
                                            <option value="">W</option>
                                            <option value="">X</option>
                                            <option value="">Y</option>
                                            <option value="">Z</option>
                                        </select>
                                    </div>
                                    <table className="table table-dark table-striped">
                                        <thead>
                                            <tr>
                                                <th scope="col">Nombre</th>
                                                <th scope="col">Telefono</th>
                                                <th scope="col">Email</th>
                                                <th scope="col">Condición de Pago</th>
                                                <th scope="col">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                this.state.clientes.map(cliente => (
                                                    <tr key={cliente.id}>
                                                        <th>{cliente.nombre}</th>
                                                        <th>{cliente.telefono}</th>
                                                        <th>{cliente.email}</th>
                                                        <th>{cliente.pago}</th>
                                                        <th>
                                                            <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                                                <button
                                                                    className="btn btn-danger"
                                                                    onClick={() => this.deleteCliente(cliente.id)}
                                                                >
                                                                    Delete
                                                                </button>
                                                                <Link className="btn btn-info" to={'/editCliente/' + cliente.id}>
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
