import './App.css';
import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Home from './components/Home'
/**Gerente */
import MenuGerente from './components/menuGerente/Home'
import MarcaEquipo from './components/menuGerente/EuipoMarcas'
import ModelEquipo from './components/menuGerente/EquipoModel'
import ListEquipos from './components/menuGerente/ListEquipos'
import Clientes from './components/menuGerente/Clientes'
import ListClientes from './components/menuGerente/ListClientes'
import Categoria from './components/menuGerente/Categoria'
import Producto from './components/menuGerente/Producto'
import Stock from './components/menuGerente/Stock'
import Registrar from './components/Registrar'
import ListUsers from './components/menuGerente/ListUsers'

/*Tecnico */

import MenuTecnico from './components/menuTecnico/Home'
import StockTecnico from'./components/menuTecnico/Stock'
import OdenTrabajo from './components/menuTecnico/ordenTrabajo'
import Seguimiento from './components/menuTecnico/Seguimiento'
import EditOT from './components/menuTecnico/editOT'
import Historico from './components/menuTecnico/Historico'
import VerOT from './components/menuTecnico/verOT'

/*Administrador */

import MenuAdministrador from './components/menuAdministrador/Home'
import Remito from'./components/menuAdministrador/Remito'
import ListRemitos from './components/menuAdministrador/ListRemitos'
import Factura from './components/menuAdministrador/Factura'
import ListFactura from './components/menuAdministrador/ListFactura'

function App() {
  return (
      <Router>
        <Route path="/" exact component={Home}/>
        {/**Administrador */}
        <Route path="/menuAdministrador"  exact component={MenuAdministrador}/>
        <Route path="/remito"  exact component={Remito}/>
        <Route path="/listRemito"  exact component={ListRemitos}/>
        <Route path="/editRemito/:id"  exact component={Remito}/>
        <Route path="/factura"  exact component={Factura}/>
        <Route path="/listFactura"  exact component={ListFactura}/>
        <Route path="/editFactura/:id"  exact component={Factura}/>
        {/*Gerente */}
        <Route path="/menuGerente"  exact component={MenuGerente}/>
        <Route path="/equipoMarca"  exact component={MarcaEquipo}/>
        <Route path="/equipoModel"  exact component={ModelEquipo}/>
        <Route path="/listEquipo"  exact component={ListEquipos}/>
        <Route path="/clientes"  exact component={Clientes}/>
        <Route path="/listClientes"  exact component={ListClientes}/>
        <Route path="/editCliente/:id"  exact component={Clientes}/>
        <Route path="/categoria"  exact component={Categoria}/>
        <Route path="/producto"  exact component={Producto}/>
        <Route path="/editProducto/:id"  exact component={Producto}/>
        <Route path="/stock"  exact component={Stock}/>
        {/*Tecnico*/}
        <Route path="/menuTecnico"  exact component={MenuTecnico}/>
        <Route path="/stockTecnico"  exact component={StockTecnico}/>
        <Route path="/ordenTrabajo"  exact component={OdenTrabajo}/>
        <Route path="/seguimiento"  exact component={Seguimiento}/>
        <Route path="/editOT/:id"  exact component={EditOT}/>
        <Route path="/historico"  exact component={Historico}/>
        <Route path="/verOT/:id"  exact component={VerOT}/>

        <Route path="/createUsers/"  exact component={Registrar}/>
        <Route path="/listUsers/"  exact component={ListUsers}/>
        <Route path="/editUsers/:id"  exact component={Registrar}/>
      </Router>
  );
}

export default App;
