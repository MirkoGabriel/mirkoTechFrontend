import React, { Component } from 'react'
import axios from 'axios'
import swal from 'sweetalert'
import Cookies from 'universal-cookie'

const cookies = new Cookies()

export default class Home extends Component {
    state = {
        Email: '',
        Password: ''
    }
    onSubmit = async (e) => {
        e.preventDefault();
        console.log(this.state.Email, this.state.Password)
        await axios.get('http://localhost:8000/api/users/?email=' + this.state.Email + '&password=' + this.state.Password).then(res => {
            // do stuff
            var kind = res.data[0].kind

            if (kind === 'G') {
                console.log('Gerente')
                cookies.set('kind',kind,{path:"/"})
                window.location.href = '/menuGerente';
            } else if (kind === 'T') {
                console.log('Tecnico')
                cookies.set('kind',kind,{path:"/"})
                window.location.href = '/menuTecnico';
            } else if (kind === 'A') {
                console.log('Administrador')
                cookies.set('kind',kind,{path:"/"})
                window.location.href = '/menuAdministrador';
            } else if (kind === 'V') {
                console.log('Vendedor')
                cookies.set('kind',kind,{path:"/"})
                window.location.href = '/menuVendedor';
            }

        }).catch(err => {
            // what now?
            console.log(err);
            swal({
                text: 'User no exists',
                icon: 'error'
            })
        })
    }
    onInputChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    
    render() {
        return (
                <div className="container">
                    <div className="row justify-content-center pt-5 mt-5 mr-1">
                        <div className="col-md-3 formulario">
                            <div className="card card-body">
                                <div className="form-group text-center">
                                    <h4>Iniciar Sesión</h4>
                                </div>
                                
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Email"
                                        onChange={this.onInputChange}
                                        name="Email"
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="password"
                                        className="form-control"
                                        placeholder="Password"
                                        onChange={this.onInputChange}
                                        name="Password"
                                    />
                                </div>
                                <div className="form-group text-center">
                                    <form onSubmit={this.onSubmit}>
                                        <button type="submit" className="btn btn-secondary btn-xs btn-block">
                                            Sign in
                                        </button>
                                    </form>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}
