import React from "react";
import { Form, Icon, Input, Button } from "antd";
import http from "utils/http";
import storage from "utils/storage";
import "./style.scss";
const FormItem = Form.Item;

class Login extends React.Component {
  state = {
    showVerification: false,
    loading: false,
    showModal: false,
    modalLoading: false,
    token: ""
  };

  handleLoginSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
        this.login(values);
      }
    });
  };

  handleCancel = () => {
    this.setState({
      showModal: false
    });
  };

  login = values => {
    this.setState({
      loading: true
    });
    http
      .post("/login/admin", values)
      .then(res => {
        console.log(res);
        storage.setUser(res.data);
        this.props.history.push("/users");
      })
      .finally(() => {
        // TODO:cancel setState when success
        this.setState({
          loading: false
        });
      });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.state;
    return (
      <div className="login">
        <div className="login-header">
          <h1> TicTalk 桌上足球联赛报名 </h1>{" "}
        </div>{" "}
        <Form onSubmit={this.handleLoginSubmit} className="login-form">
          <FormItem>
            {" "}
            {getFieldDecorator("username", {
              validateTrigger: "onBlur",
              rules: [
                {
                  required: true,
                  message: "请输入用户名"
                },
                {
                  type: "string",
                  message: "用户名格式不合法"
                }
              ]
            })(
              <Input
                prefix={
                  <Icon
                    type="user"
                    style={{
                      color: "rgba(0,0,0,.25)"
                    }}
                  />
                }
                size="large"
                placeholder="邮箱"
              />
            )}{" "}
          </FormItem>{" "}
          <FormItem>
            {" "}
            {getFieldDecorator("password", {
              validateTrigger: "onBlur",
              rules: [
                {
                  required: true,
                  message: "请输入密码"
                }
              ]
            })(
              <Input
                prefix={
                  <Icon
                    type="lock"
                    style={{
                      color: "rgba(0,0,0,.25)"
                    }}
                  />
                }
                size="large"
                type="password"
                placeholder="密码"
              />
            )}{" "}
          </FormItem>{" "}
          <FormItem
            style={{
              marginTop: "40px"
            }}
          >
            <Button
              loading={loading}
              size="large"
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              登录{" "}
            </Button>{" "}
          </FormItem>{" "}
        </Form>{" "}
        <div className="login-footer">
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://www.tictalk.com"
          >
            Copyright© 2018 TicTalk{" "}
          </a>{" "}
        </div>{" "}
      </div>
    );
  }
}

export default Form.create()(Login);
