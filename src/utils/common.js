import { notification } from 'antd';

export default class common {
  static showSuccess() {
    notification.success({
      message: '操作成功',
      duration: 1.5
    });
  }
}
