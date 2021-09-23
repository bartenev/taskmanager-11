export default class Provider {
  constructor(api) {
    this._api = api;
  }

  getTasks() {
    return this._api.getTasks();
  }

  createTask(data) {
    return this._api.createTask(data);
  }

  updateTask(id, data) {
    return this._api.updateTask(id, data);
  }

  deleteTask(id) {
    return this._api.deleteTask(id);
  }
}
