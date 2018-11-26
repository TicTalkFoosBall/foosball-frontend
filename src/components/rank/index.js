import React from "react";
import { Form, Input, Table, Card, Row, Col, Button, Modal } from "antd";
import http from "utils/http";
import common from "utils/common";
import "./style.scss";

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
  }
};

const PAGE_SIZE = 10;

class Rank extends React.Component {
  state = {
    loading: false,
    rank: [],
    current: 1,
    total: 0,
    visible: false,
    user: {},
    confirmLoading: false
  };

  columns = [
    {
      title: "昵称",
      dataIndex: "username",
      key: "username"
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email"
    },
    {
      title: "操作",
      key: "is_active",
      render: (text, record) => (
        <span>
          {record.is_active ? (
            <Button
              data-id={record.id}
              onClick={e => this.forbiddenUser(e)}
              type="danger"
            >
              封禁
            </Button>
          ) : (
            <Button
              data-id={record.id}
              onClick={e => this.relieveUser(e)}
              type="primary"
            >
              解封
            </Button>
          )}
        </span>
      )
    }
  ];

  componentDidMount() {
    const { current } = this.state;
    this.getUsers(current, PAGE_SIZE);
  }
  onChange = (key, e) => {
    const { user } = this.state;
    const {
      target: { value }
    } = e;
    user[key] = value ? value.trim() : "";
    this.setState({ user: { ...user } });
  };

  showModal = () => {
    this.setState({
      visible: true,
      user: {}
    });
  };

  handleOk = () => {
    const { user } = this.state;
    if (!user.username || !user.password) {
      return;
    }
    this.addUser(user);
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  confirmAction = ({ email, status }, index) => {
    if (status !== 0 && status !== 1) return;
    const action = { 0: "put", 1: "delete" };
    http[action[status]](`/admin/user/block/${email}`).then(() => {
      const { users } = this.state;
      users[index].status = status === 0 ? 1 : 0;
      this.setState({ users: [...users] });
    });
  };

  handleSearch = e => {
    e && e.preventDefault();
    const { getFieldsValue } = this.props.form;
    const { identity } = getFieldsValue();
    this.getUsers(1, PAGE_SIZE, identity);
  };

  handleReset = () => {
    const { resetFields } = this.props.form;
    resetFields();
    this.handleSearch();
  };

  getRank = (page, pageSize) => {
    this.setState({ loading: true });
    http
      .get("/rank", { params: { page: page, per_page: pageSize } })
      .then(res => {
        const { data, headers } = res;
        const total = Number(headers["x-total"]);
        this.setState(() => ({
          rank: data,
          current: page,
          total
        }));
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  addUser = values => {
    this.setState({ confirmLoading: true });
    const { current } = this.state;
    http
      .post("/admin/admin_users", values)
      .then(() => {
        this.setState({ visible: false });
        common.showSuccess();
        this.getUsers(current, PAGE_SIZE);
      })
      .finally(() => {
        this.setState({ confirmLoading: false });
      });
  };

  relieveUser = e => {
    const id = e.target.getAttribute("data-id");
    const { current } = this.state;
    http.patch(`/admin/admin_users/${id}`, { is_active: true }).then(() => {
      common.showSuccess();
      this.getUsers(current, PAGE_SIZE);
    });
  };

  forbiddenUser = e => {
    const id = e.target.getAttribute("data-id");
    const { current } = this.state;
    http.patch(`/admin/admin_users/${id}`, { is_active: false }).then(() => {
      common.showSuccess();
      this.getUsers(current, PAGE_SIZE);
    });
  };

  render() {
    const {
      users,
      loading,
      current,
      total,
      visible,
      user,
      confirmLoading
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="users">
        <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
          <Row type="flex" align="middle" gutter={24}>
            <Col span={8}>
              <FormItem label="昵称">
                {getFieldDecorator("identity")(<Input />)}
              </FormItem>
            </Col>
            <Col
              className="search-action"
              style={{ marginBottom: "24px" }}
              span={16}
            >
              <div style={{ display: "flex" }}>
                <Button type="primary" htmlType="submit">
                  搜索
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                  清除
                </Button>
              </div>
              <Button onClick={this.showModal} type="primary">
                新增用户
              </Button>
            </Col>
          </Row>
        </Form>
        <Card>
          <Table
            loading={loading}
            rowKey="email"
            columns={this.columns}
            dataSource={users}
            pagination={{
              total,
              onChange: this.getUsers,
              current,
              defaultPageSize: PAGE_SIZE
            }}
          />
        </Card>
        <Modal
          title="新增用户"
          visible={visible}
          confirmLoading={confirmLoading}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <FormItem {...formItemLayout} label="昵称" help="6 到 16 位">
            <Input
              value={user.username}
              onChange={value => this.onChange("username", value)}
            />
          </FormItem>
          <FormItem {...formItemLayout} label="邮箱" help="邮箱">
            <Input
              type="email"
              value={user.email}
              onChange={value => this.onChange("email", value)}
            />
          </FormItem>
          <FormItem {...formItemLayout} label="密码" help="6 到 16 位">
            <Input
              type="password"
              value={user.password}
              onChange={value => this.onChange("password", value)}
            />
          </FormItem>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(Rank);
