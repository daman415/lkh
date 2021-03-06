import React, {Component} from 'react'
import Form from './Form'
import {getAllDataLkhDetail, getAllDataLkhDetailPerBulan} from './ApiDataLkh'
import {Button, Modal} from 'react-bootstrap';
import Swal from 'sweetalert2'
import moment from "moment";
import 'moment/locale/id';
import {Link} from "react-router-dom";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";

moment().locale('id')

class IndexDataDetailLkhDetail extends Component {
  constructor() {
    super();
    this.state = {
      isModalOpen: 'Tes',
      page: 1,
      limit: 10,
      lastPage: '',
      panjang: 0,

      data: [],
      dataProfil: [],
      dataPerBulan: [],
      searchData: '',
      loadingButton: false,

      clickTable: [],
      tipeForm: 1,

      index: '',
      setShow: false,
      post: {
        id: '',
        status: '',
        tanggal_pekerjaan: '',
        first_name: '',
        last_name: '',
        email: '',
        role: '',
        password: ''
      },
      modalShow: "modal fade"
    };
  }

  componentDidMount() {
    this.getAll()
  }

  getAll = () => {
    const postData = {
      id_user: this.props.location.item.idUser,
      token: localStorage.usertoken,
      page: this.state.page,
      limit: this.state.limit,
      searchData: null,
    }

    getAllDataLkhDetail(postData).then(data => {
      this.setState({
        data: data.dataLkh.data,
        dataProfil: data.dataProfil,
        lastPage: data.lastPage,
        panjang: data.total,
      })
    })
  }

  handlePrevPage = () => {
    this.setState({
      data: [],
    })
    const postData = {
      id_user: this.props.location.item.idUser,
      token: localStorage.usertoken,
      page: this.state.page - 1,
      limit: this.state.limit,
      searchData: null,
    }

    getAllDataLkhDetail(postData).then(data => {
      this.setState({
        data: data.dataLkh.data,
        lastPage: data.lastPage,
        panjang: data.total,
      })
    })
  }

  handleNextPage = () => {
    this.setState({
      data: [],
    })
    const postData = {
      id_user: this.props.location.item.idUser,
      token: localStorage.usertoken,
      page: this.state.page - 1,
      limit: this.state.limit,
      searchData: null,
    }

    getAllDataLkhDetail(postData).then(data => {
      this.setState({
        data: data.dataLkh.data,
        lastPage: data.lastPage,
        panjang: data.total,
      })
    })
  }


  handleSearch = event => {
    console.log(event.target.value)
    if (event !== '') {
      const cari = event.target.value;
      this.setState({
        searchData: cari,
        data: [],
      });

      const postData = {
        id_user: this.props.location.item.idUser,
        token: localStorage.usertoken,
        page: this.state.page - 1,
        limit: this.state.limit,
        searchData: cari,
      }

      getAllDataLkhDetail(postData).then(data => {
        this.setState({
          data: data.dataLkh.data,
          lastPage: data.lastPage,
          panjang: data.total,
        })
      })
    } else {
      this.getAll()
    }

  }


  handleClickTable(e) {
    this.state.clickTable[e] = true
  }


  handleLihatLaporan(e) {
    this.setState({
      tipeForm: 1,
      setShow: true,
    })

    const postData = {
      id_user: this.props.location.item.idUser,
      token: localStorage.usertoken,
      tanggal_pekerjaan: this.state.data[e].tanggal_pekerjaan,
    }

    getAllDataLkhDetailPerBulan(postData).then(data => {
      this.setState({
        dataPerBulan: data.data
      })
    })

  }

  handleDownloadLaporan(e) {

    const postData = {
      id_user: this.props.location.item.idUser,
      token: localStorage.usertoken,
      tanggal_pekerjaan: this.state.data[e].tanggal_pekerjaan,
    }

    getAllDataLkhDetailPerBulan(postData).then(data => {
      const nama = this.state.dataProfil.first_name
      const tanggalPekerjaan = moment(this.state.data[e].tanggal_pekerjaan).format("MMMM")

      const namaFile = 'LKH ' + nama + ' Bulan ' + tanggalPekerjaan
      var dataLkh = data.data
      const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const fileExtension = '.xlsx';


      const ws = XLSX.utils.json_to_sheet(dataLkh);
      const wb = {Sheets: {'data': ws}, SheetNames: ['data']};
      const excelBuffer = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});
      var dataE = new Blob([excelBuffer], {type: fileType});
      FileSaver.saveAs(dataE, namaFile + fileExtension);
    })


  }


  renderTableData() {
    return this.state.data.map((user, index) => {
      const {tanggal_pekerjaan, status} = user //destructuring
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{moment(tanggal_pekerjaan).format("MMMM YYYY")}</td>
          <td>{status === 0?<span className="right badge badge-danger">Belum di Verifikasi</span>:<span className="right badge badge-success">Telah Diverifikasi</span>}</td>
          <td>
            <button onClick={() => {
              this.handleDownloadLaporan(index)
            }} style={{marginRight: 10}}
                    className="btn btn-info btn-xs">
              <i className="fas fa-download" style={{marginRight: 4}}></i>
              Download LKH
            </button>
            <button onClick={() => {
              this.handleLihatLaporan(index)
            }} style={{marginRight: 10}}
                    className="btn btn-warning btn-xs">
              <i className="fas fa-eye" style={{marginRight: 4}}></i>
              Lihat LKH
            </button>
          </td>
        </tr>
      )
    })
  }

  renderTableDataDetail() {
    return this.state.dataPerBulan.map((user, index) => {
      const {tanggal_pekerjaan, detail_pekerjaan} = user //destructuring
      return (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{moment(tanggal_pekerjaan).format("MMMM")}</td>
          <td>{detail_pekerjaan}</td>
        </tr>
      )
    })
  }

  render() {
    const namaUser = this.state.dataProfil.first_name + ' ' + this.state.dataProfil.last_name
    const role = this.state.dataProfil.role
    const handleClose = () => this.setState({setShow: false});
    return (
      <div style={{marginLeft:10,marginRight:10}}>
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="m-0 text-dark">Data Lkh Detail</h1>
              </div>
              <div className="col-sm-6">
                <ol className="breadcrumb float-sm-right">
                  <Link to="dashboard" className="breadcrumb-item"><a>Dashboard</a></Link>
                  <Link to="data-lkh" className="breadcrumb-item">Data LkhDetail</Link>
                  <li className="breadcrumb-item active">Data Detail LkhDetail</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <section className="content">
          <div className="row">
            <div className="col-md-3">
              <div className="card card-primary card-outline">
                <div className="card-body box-profile">
                  <div className="text-center">
                    <img className="profile-user-img img-fluid img-circle"
                         src="assets/avatar.png"
                         alt="User profile picture"/>
                  </div>
                  <h3 className="profile-username text-center">{namaUser}</h3>
                  <p className="text-muted text-center">{role}</p>
                </div>
              </div>
            </div>
            <div className="col-md-9">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Data Lkh</h3>
                    <div className="card-tools">
                      <div className="input-group input-group-sm" style={{width: 150}}>
                        <input type="text" value={this.state.searchData} onChange={this.handleSearch}
                               className="form-control float-right"
                               placeholder="Search"/>
                        <div className="input-group-append">
                          <button type="submit" className="btn btn-default"><i className="fas fa-search"></i></button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body table-responsive p-0">
                    <table className="table table-striped table-hover table-bordered table-sm">
                      <thead>
                      <tr>
                        <th style={{width: 10}}>No</th>
                        <th>Bulan</th>
                        <th>Status</th>
                        <th>Aksi</th>
                      </tr>
                      </thead>
                      <tbody>
                      {this.renderTableData()}
                      </tbody>
                    </table>
                  </div>
                  <div className="card-footer clearfix">
                    <ul className="pagination pagination-sm m-0 float-right">
                      <li className="page-item">
                        {this.state.page !== 1 ?
                          <button className="page-link" onClick={this.handlePrevPage}>??</button> :
                          <button className="page-link" disabled={true}>??</button>}
                      </li>

                      <li className="page-item">
                        {this.state.lastPage !== this.state.page ?
                          <button className="page-link" onClick={this.handleNextPage}>??</button> :
                          <button className="page-link" disabled={true}>??</button>}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Modal
            show={this.state.setShow}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>{
                this.state.tipeForm === 1 ? 'Verifikasi LKH ' + this.state.post.first_name + ' Bulan ' + moment(this.state.post.tanggal_pekerjaan).format("MMMM") + ' ?' :
                  this.state.tipeForm === 2 ? 'Edit Data ' + this.state.post.first_name :
                    this.state.tipeForm === 3 ? 'Hapus Data ' + this.state.post.first_name + ' ?' : ''}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {this.state.tipeForm === 1 ?
                <div>
                  <div className="card-body table-responsive p-0">
                    <table className="table table-striped table-hover table-bordered table-sm">
                      <thead>
                      <tr>
                        <th style={{width: 10}}>No</th>
                        <th>Tanggal</th>
                        <th>Keterangan</th>
                      </tr>
                      </thead>
                      <tbody>
                      {this.renderTableDataDetail()}
                      </tbody>
                    </table>
                  </div>
                </div> :
                <Form
                  tipeForm={this.state.tipeForm}
                  loadingButton={this.state.loadingButton}
                  handleChange={this.handleChange}
                  post={this.state.post}
                  handleSubmitForm={this.handleSubmit}/>}

            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </section>
      </div>
    )
  }
}

export default IndexDataDetailLkhDetail
