import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import swal from "@sweetalert/with-react";
import { Form, Label } from "semantic-ui-react";

// Utils
import { isEmail } from "../Utils/Format";

// Theme
import theme from "../Constants/Theme";

class Register extends Component {
  state = {
    email: "",
    password: "",
    loading: false
  };

  _handleChange = event => {
    const { name, value } = event.target;

    this.setState({
      [name]: value
    });
  };

  _handleRegister = () => {
    const { email, password } = this.state;

    const userInfo = {
      email,
      password
    };

    if (email === "" || password === "") return;

    this.setState({
      loading: true
    });

    if (!isEmail(email)) {
      this.setState({
        loading: false
      });

      return swal({
        text: "Invalid email format, please try again.",
        button: "Okay"
      });
    }

    if (password.length < 6) {
      this.setState({
        loading: false
      });

      return swal({
        text: "Password must be atleast 6 characters long.",
        button: "Okay"
      });
    }

    axios
      .post("/auth/register", userInfo)
      .then(() => {
        this.setState({
          loading: false
        });

        this.props.history.push("/dashboard/documents");
      })
      .catch(err => {
        this.setState({
          loading: false
        });

        const error = Object.create(err);

        if (error.response.status === 400) {
          error.message = "Username and Password are required";
        } else if (error.response.status === 401) {
          error.message = "This email is already in use";
        } else {
          error.message = "Internal Server Error";
        }

        swal({
          text: error.message,
          button: "Okay"
        });
      });
  };

  render() {
    const styles = this.getStyles();
    const { loading } = this.state;

    return (
      <div style={styles.widget}>
        <div style={styles.loginContainer}>
          <Form style={styles.form} size="small">
            <Label color="red" ribbon style={{ left: -35 }}>
              1095C Generator
            </Label>
            <Form.Input
              required
              placeholder="Email"
              name="email"
              onChange={this._handleChange}
              style={{ marginTop: theme.Spacing.LARGE }}
            />
            <Form.Input
              required
              placeholder="Password"
              type="password"
              name="password"
              onChange={this._handleChange}
            />
            <Form.Button
              fluid
              type="submit"
              onClick={this._handleRegister}
              loading={loading}
            >
              Register
            </Form.Button>
          </Form>
          <div style={styles.cancel}>
            <p>Already have an account?</p>
            <Link
              to="/"
              style={{
                marginLeft: theme.Spacing.SMALL,
                color: theme.FontSizes
              }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  getStyles = () => ({
    widget: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-around",
      background: "#f9fafb"
    },
    loginContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      background: theme.Colors.WHITE,
      padding: theme.Spacing.LARGE,
      borderRadius: theme.BorderRadius.SMALL,
      border: theme.Border.DEFAULT
    },
    logoContainer: {
      background: "#1b1c1d",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: theme.Spacing.MEDIUM,
      color: theme.Colors.GRAY
    },
    form: {
      width: 250,
      height: 200
    },
    cancel: {
      width: "100%",
      fontSize: theme.FontSizes.LARGE,
      color: theme.FontColors.GRAY,
      marginTop: theme.Spacing.LARGE,
      fontWeight: 500,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  });
}

export default Register;
