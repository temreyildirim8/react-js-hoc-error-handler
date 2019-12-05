import React, { Component } from "react";
import axios from "axios";
import AuxComponent from "../AuxComponent";
import Simplert from "react-simplert";

const withErrorHandler = (WrappedComponent, axios) => {
  return class extends Component {
    state = {
      error: null
    };

    componentWillMount() {
      axios.interceptors.request.use(
        req => {
          this.setState({
            error: null
          });
          return req;
        },
        error => Promise.reject(error)
      );
      axios.interceptors.response.use(
        resp => {
          console.log("withErrorHandler response", resp);
          return resp;
        },
        error => {
          console.log("withErrorHandler Error", error.response);
          this.setState({
            error: error
          });
          return Promise.reject(error);
        }
      );
    }
    render() {
      return (
        <AuxComponent>
          <Simplert
            showSimplert={this.state.error}
            type="error"
            title="Error"
            message={
              this.state.error && this.state.error.response
                ? this.state.error.response.status +
                  " " +
                  this.state.error.response.data.error +
                  "/" +
                  this.state.error.response.data.message
                : ""
            }
          />
          <WrappedComponent {...this.props} />
        </AuxComponent>
      );
    }
  };
};

export default withErrorHandler;
