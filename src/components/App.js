import React, { Component } from 'react';
import Web3 from 'web3';
import logo from '../logo.png';
import './App.css';
import EthDonation from '../abis/EthDonation'
import Addressbar from './Addressbar'
import Main from './main'
import { Route, Switch } from 'react-router-dom';
import Donor from './donor'
import Donee from './donee'
import MoneyDonation from './moneydonation'

class App extends Component {
  state = {
    doneeaccount: '',
    totalNumber: 0,
    items: [],
    donations:[],
    loading: true

  }

  async componentDidMount() {
    await this.getWeb3Provider();
    await this.connectToBlockchain();
  }



  async getWeb3Provider() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }



  async connectToBlockchain() {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = EthDonation.networks[networkId];
    if (networkData) {
      const deployedEthDonation = new web3.eth.Contract(EthDonation.abi, networkData.address);
      //const contractNum = await deployedEthDonation.methods.getNumofCampaigns().call();
      this.setState({ deployedEthDonation: deployedEthDonation });

      //items
      const serialNumber = await deployedEthDonation.methods.sn().call();
      console.log(serialNumber);
      this.setState({ serialNumber })

      for (var i = 1; i <= serialNumber; i++) {
        const item = await deployedEthDonation.methods.items(i).call();
        this.setState({
          items: [...this.state.items, item]
        });
      }
  


      //donations
      const donateNumber = await deployedEthDonation.methods.dn().call()
      console.log(donateNumber);
      this.setState({ donateNumber })
      for (var j = 1; j <= donateNumber; j++) {
        const donation = await deployedEthDonation.methods.donations(j).call();
        this.setState({
          donations: [...this.state.donations, donation]
        });
      }

      this.setState({ loading: false })
      console.log(this.state.items)
      console.log(this.state.donations)


      

    } else {
      window.alert('EthDonation contract is not found in your blockchain.')
    }
    

  }


  createItem = async (itemName, amount) => {
    this.setState({ loading: true })
    const gasAmount = await this.state.deployedEthDonation.methods.createItem(itemName, amount).estimateGas({ from: this.state.account })
    this.state.deployedEthDonation.methods.createItem(itemName, amount).send({ from: this.state.account, gas: gasAmount })
      .once('receipt', (receipt) => {
        // const serialNumber = this.state.deployedEthDonation.methods.sn().call();
        // const item = this.state.deployedEthDonation.methods.items(serialNumber).call();
        // // this.setState({
        // //   items: [...this.state.items, item]});                
        this.setState({ loading: false });
        document.location.reload()
      })
  }


  donateItem = async (itemId, amount) => {
    this.setState({ loading: true })
    try {
      const gasAmount = await this.state.deployedEthDonation.methods.donateItem(itemId, amount).estimateGas({ from: this.state.account })

      const receipt = this.state.deployedEthDonation.methods.donateItem(itemId, amount).send({ from: this.state.account })

        .on('receipt', (receipt) => {
          this.setState({ loading: false });
          document.location.reload()
        })
        .on('error', console.error);
    }
    catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        error,
      );
      console.error(error);
      document.location.reload()

    }
  }

  transportItem = async (donateNo, trackingNo) => {
    this.setState({ loading: true })
    try {
      const gasAmount = await this.state.deployedEthDonation.methods.transportItem(donateNo, trackingNo).estimateGas({ from: this.state.account })

      const receipt = this.state.deployedEthDonation.methods.transportItem(donateNo, trackingNo).send({ from: this.state.account })

        .on('receipt', (receipt) => {
          this.setState({ loading: false });
          document.location.reload()
        })
        .on('error', console.error);
    }
    catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        error,
      );
      console.error(error);
      document.location.reload()

    }
  }

  receiveItem = async (donateNo) => {
    this.setState({ loading: true })
    try {
      const gasAmount = await this.state.deployedEthDonation.methods.receiveItem(donateNo).estimateGas({ from: this.state.account })

      const receipt = this.state.deployedEthDonation.methods.receiveItem(donateNo).send({ from: this.state.account })

        .on('receipt', (receipt) => {
          this.setState({ loading: false });
          document.location.reload()
        })
        .on('error', console.error);
    }
    catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        error,
      );
      console.error(error);
      document.location.reload()

    }
  }

  cancelDonation = async (donateNo) => {
    this.setState({ loading: true })
    try {
      const gasAmount = await this.state.deployedEthDonation.methods.cancelDonation(donateNo).estimateGas({ from: this.state.account })

      const receipt = this.state.deployedEthDonation.methods.cancelDonation(donateNo).send({ from: this.state.account })

        .on('receipt', (receipt) => {
          this.setState({ loading: false });
          document.location.reload()
        })
        .on('error', console.error);
    }
    catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        error,
      );
      console.error(error);
      document.location.reload()

    }
  }

  endDonation = async (serialNo) => {
    this.setState({ loading: true })
    try {
      const gasAmount = await this.state.deployedEthDonation.methods.receiveItem(serialNo).estimateGas({ from: this.state.account })

      const receipt = this.state.deployedEthDonation.methods.receiveItem(serialNo).send({ from: this.state.account })

        .on('receipt', (receipt) => {
          this.setState({ loading: false });
          document.location.reload()
        })
        .on('error', console.error);
    }
    catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        error,
      );
      console.error(error);
      document.location.reload()

    }
  }

  listSerialNo = async (donee) => {
    this.setState({ loading: true })
    try {
      const gasAmount = await this.state.deployedEthDonation.methods.listSerialNo(donee).estimateGas({ from: this.state.account })

      const receipt = this.state.deployedEthDonation.methods.listSerialNo(donee).send({ from: this.state.account })

        .on('receipt', (receipt) => {
          this.setState({ loading: false });
          document.location.reload()
        })
        .on('error', console.error);
    }
    catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        error,
      );
      console.error(error);
      document.location.reload()

    }
  }

  listDonateNo = async (donor) => {
    this.setState({ loading: true })
    try {
      const gasAmount = await this.state.deployedEthDonation.methods.listDonateNo(donor).estimateGas({ from: this.state.account })

      const receipt = this.state.deployedEthDonation.methods.listDonateNo(donor).send({ from: this.state.account })

        .on('receipt', (receipt) => {
          this.setState({ loading: false });
          document.location.reload()
        })
        .on('error', console.error);
    }
    catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        error,
      );
      console.error(error);
      document.location.reload()

    }
  }

  doneeRecord = async (serialNo) => {
    this.setState({ loading: true })
    try {
      const gasAmount = await this.state.deployedEthDonation.methods.doneeRecord(serialNo).estimateGas({ from: this.state.account })

      const receipt = this.state.deployedEthDonation.methods.doneeRecord(serialNo).send({ from: this.state.account })

        .on('receipt', (receipt) => {
          this.setState({ loading: false });
          document.location.reload()
        })
        .on('error', console.error);
    }
    catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        error,
      );
      console.error(error);
      document.location.reload()

    }
  }

  donorRecord = async (donateNo) => {
    this.setState({ loading: true })
    try {
      const gasAmount = await this.state.deployedEthDonation.methods.donorRecord(donateNo).estimateGas({ from: this.state.account })

      const receipt = this.state.deployedEthDonation.methods.donorRecord(donateNo).send({ from: this.state.account })

        .on('receipt', (receipt) => {
          this.setState({ loading: false });
          document.location.reload()
        })
        .on('error', console.error);
    }
    catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        error,
      );
      console.error(error);
      document.location.reload()

    }
  }











  render() {
    return (
      <div>
        <Addressbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row ">
            <main>
              {this.state.loading
                ?
                <div><p className="text-center">Loading ...</p></div>
                :
                <Switch>
                  <Route exact path="/">
                    <Main items={this.state.items}
                      donations={this.state.donations}
                      createItem={this.createItem}
                      donateItem={this.donateItem}
                      transportItem={this.transportItem}
                      receiveItem={this.receiveItem}
                      cancelDonation={this.cancelDonation}
                      endDonation={this.endDonation}
                      listDonateNo={this.listDonateNo}
                      listSerialNo={this.listSerialNo}
                      doneeRecord={this.doneeRecord}
                      donorRecord={this.donorRecord}

                    />
                  </Route>
                  <div>

                    <Route path="/donor">
                      <Donor
                      contracts={this.state.deployedEthDonation}
                      items={this.state.items}
                      donations={this.state.donations}
                      createItem={this.createItem}
                      donateItem={this.donateItem}
                      transportItem={this.transportItem}
                      receiveItem={this.receiveItem}
                      cancelDonation={this.cancelDonation}
                      endDonation={this.endDonation}
                      listDonateNo={this.listDonateNo}
                      listSerialNo={this.listSerialNo}
                      doneeRecord={this.doneeRecord}
                      donorRecord={this.donorRecord}

                      />
                    </Route>

                    <Route path="/donee">
                      <Donee
                      contracts={this.deployedEthDonation}
                      items={this.state.items}
                      createItem={this.createItem}
                      donateItem={this.donateItem}
                      transportItem={this.transportItem}
                      receiveItem={this.receiveItem}
                      cancelDonation={this.cancelDonation}
                      endDonation={this.endDonation}
                      listDonateNo={this.listDonateNo}
                      listSerialNo={this.listSerialNo}
                      doneeRecord={this.doneeRecord}
                      donorRecord={this.donorRecord}

                      />
                    </Route>
                  

                    
                    <Route path="/moneydonation" component={MoneyDonation}>
                    </Route>
                  </div>


                </Switch>

              }

            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;