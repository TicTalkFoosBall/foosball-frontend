const userKey = 'user';
export default class storage {
  static getItem(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  static setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static removeItem(key) {
    localStorage.removeItem(key);
  }

  static clear() {
    localStorage.clear();
  }

  static setUser(value) {
    localStorage.setItem(userKey, JSON.stringify(value));
  }

  static getUser() {
    return JSON.parse(localStorage.getItem(userKey)) || {};
  }

  static removeUser() {
    localStorage.removeItem(userKey);
  }

  static getToken() {
    const user = storage.getUser();
    return user ? user.token : '';
  }
}
