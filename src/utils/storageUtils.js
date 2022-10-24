import store from "store";
const USER_KEY = "USER-KEY";

const storageUtils = {
  saveUser(user) {
    // localStorage.setItem(user_key, JSON.stringify(user));
    store.set(USER_KEY, user);
  },
  getUser() {
    // return localStorage.getItem(user_key) || {};
    return store.get(USER_KEY) || {};
  },
  removeUser() {
    // localStorage.removeItem(USER_KEY);
    store.remove(USER_KEY);
  },
};
export default storageUtils;
