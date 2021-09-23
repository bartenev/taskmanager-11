const isOnline = () => {
  return window.navigator.onLine;
};

export default class Provider {
  constructor(api) {
    this._api = api;
  }

  getTasks() {
    if (isOnline()) {
      return this._api.getTasks();
    }

    return Promise.reject(`offline logic is not implemented`);
  }

  createTask(data) {
    if (isOnline()) {
      return this._api.createTask(data);
    }

    return Promise.reject(`offline logic is not implemented`);
  }

  updateTask(id, data) {
    if (isOnline()) {
      return this._api.updateTask(id, data);
    }

    return Promise.reject(`offline logic is not implemented`);
  }

  deleteTask(id) {
    if (isOnline()) {
      return this._api.deleteTask(id);
    }

    return Promise.reject(`offline logic is not implemented`);
  }
}
