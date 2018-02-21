import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Table, Button } from 'react-bootstrap';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      items:[],
      count:0,
      item:null,
      checkedouts:0
    }
  }
  componentWillMount() {
    fetch('https://0zuvo81376.execute-api.us-west-2.amazonaws.com/dev/')
      .then(result=>{
        return result.json();
      })
      .then(result=>{
        console.log(JSON.stringify(result) );
        this.setState({items:result.Items, count:result.Count})
      })
      .catch(error=>{
        console.error(error);
      })
  }
  showItem(id) {
    fetch('https://0zuvo81376.execute-api.us-west-2.amazonaws.com/dev/item?id='+id)
      .then(result=>{
        return result.json();
      })
      .then(result=>{
        console.log(JSON.stringify(result) );
        this.setState({item:result.Item})
      })
      .catch(error=>{
        console.error(error);
      })
  }
  checkOutIn(id, value) {
    let items = this.state.items.slice(0);
    for(let i=0;i<items.length;i++) {
      if(items[i].id === id ) {
        items[i].out = value;
        break;
      }
    }
    let checkedouts = this.state.checkedouts;
    if(value){
      checkedouts++;
    } else {
      checkedouts--;
    }
    this.setState({items:items, checkedouts:checkedouts});
    if((this.state.count - checkedouts)<2) {
      alert('Less than 2 books left in library');
    }
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Library</h1>
          <h2 className="App-title">Click on the id for details of the book</h2>
        </header>
        <p className="App-intro">
          Total Number of books: {this.state.count}, total checked out {this.state.checkedouts}
        </p>
        <div style={{marginLeft:10+'%', marginRight:10+'%'}}>
        {this.state.item == null?
        <Table  striped bordered condensed hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Checkout/Checkin</th>
          </tr>
        </thead>
        <tbody>
          {
            this.state.items.map(item=>{
                return <tr key={item.id}>
                          <td  style={{textAlign:'left'}}>
                          <a href="#" onClick={()=>this.showItem(item.id)} >{item.id}</a>
                          </td>
                          <td style={{textAlign:'left'}}>{item.name}</td>
                          <td>{item.out?<Button bsStyle="primary" onClick={()=>this.checkOutIn(item.id, false)}>CheckIn</Button>:<Button bsStyle="danger" onClick={()=>this.checkOutIn(item.id, true)}>CheckOut</Button>}</td>
                        </tr>
            })
          }
          
          </tbody>
        </Table>
        :
        <div>
          <h3><i className="fa fa-arrow-left text-success" onClick={()=>this.setState({item:null})} style={{cursor:'pointer'}} ></i> Book Detail</h3>
          <strong>ID:</strong><p>{this.state.item.id}</p><br/>
          <strong>NAME:</strong><p>{this.state.item.name}</p><br/>
          <strong>DESCRIPTION:</strong><p>{this.state.item.description}</p><br/>
          <strong>AUTHOR:</strong><p>{this.state.item.author}</p><br/>
        </div>
        }
        </div>
      </div>
    );
  }
}

export default App;
