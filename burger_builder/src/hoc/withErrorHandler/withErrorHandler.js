import React,{Component} from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Auxiliary';

const withErrorHandler =(WrappedComponent,axios)=>{
  return class extends Component{
    state={
      error:null
    }
    componentWillMount(){
      this.reqInterceptor = axios.interceptors.request.use(req=>{
        //clear errors, so we basically reset the state to null
        this.setState({error:null})
        return req;
      })
      //set up our axios listener
      this.resInterceptor = axios.interceptors.response.use(res=>res,error =>{
        //update the state
        this.setState({error:error})
      })
    }
    componentWillUnmount(){
      axios.interceptors.request.eject(this.reqInterceptor);
      axios.interceptors.response.eject(this.resInterceptor);
    }
    errorConfirmedHandler=()=>{
      this.setState({error:null})
    }
    render(){
      return(
        <Aux>
          <Modal 
          modalClosed={this.errorConfirmedHandler}
          show={this.state.error}>
           {this.state.error ? this.state.error.message : null}
          </Modal>
          <WrappedComponent {...this.props}/>
        </Aux>
      )
    }
  }
}

export default withErrorHandler;