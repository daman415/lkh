import React, {Component} from 'react'
import Sidebar from "./component/Sidebar";
import Footer from "./component/Footer";
import {BrowserRouter as Router, Route, Switch,Link} from "react-router-dom";
import Dashboard from "./pages-dashboard/Dashboard";
import IndexUser from "./pages-user/IndexUser";
import IndexProfile from "./pages-profile/IndexProfile";
import IndexDataLkh from "./pages-data-lkh/IndexDataLkh"
import IndexVerifikasiLkh from "./pages-verifikasi-lkh/IndexVerifikasiLkh";
import IndexDataDetailLkh from "./pages-data-lkh/IndexDataDetailLkh";

import jwt_decode from "jwt-decode";
import {getUser} from "../components/UserFunctions";


class Main extends Component {

  logOut(e) {

    e.preventDefault()
    localStorage.removeItem('usertoken')
    localStorage.removeItem('role')
    this.props.history.push('/login')


  }
  render() {
    return (
      <Router>
        <div className="wrapper">
          <nav className="main-header navbar navbar-expand navbar-light navbar-green">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" data-widget="pushmenu" role="button"><i className="fas fa-bars"></i></a>
              </li>
            </ul>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to="/profile" className="nav-link" data-widget="control-sidebar" data-slide="true"  role="button">
                  <i className="fas fa-user"></i>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/" onClick={this.logOut.bind(this)} className="nav-link" data-widget="control-sidebar" data-slide="true"  role="button">
                  <i className="fas fa-sign-out-alt"></i>
                </Link>
              </li>
            </ul>
          </nav>
          <Sidebar/>
          <Switch>
            <Route path="/profile" component={IndexProfile}/>
            <Route path="/dashboard-admin" component={Dashboard}/>
            <Route path="/user" component={IndexUser}/>
            <Route path="/data-lkh" component={IndexDataLkh}/>
            <Route path="/verifikasi-lkh" component={IndexVerifikasiLkh}/>
            <Route path="/data-lkh-detail" component={IndexDataDetailLkh}/>

          </Switch>
          <Footer/>
        </div>
      </Router>
    )
  }
}

export default Main
