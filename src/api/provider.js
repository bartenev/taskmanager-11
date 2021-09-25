import Task from "../models/task";
import {nanoid} from "nanoid";

const isOnline = () => {
  return window.navigator.onLine;
};

const getSyncedTasks = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.task);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getTasks() {
    if (isOnline()) {
      return this._api.getTasks()
        .then((tasks) => {
          const items = createStoreStructure(tasks.map((task) => task.toRAW()));

          this._store.setItems(items);
          return tasks;
        });
    }

    const storeTasks = Object.values(this._store.getItems());
    return Promise.resolve(Task.parseTasks(storeTasks));
  }

  createTask(data) {
    if (isOnline()) {
      return this._api.createTask(data)
        .then((newTask) => {
          this._store.setItem(newTask.id, newTask.toRAW());

          return newTask;
        });
    }

    const localNewTaskId = nanoid();
    const localNewTask = Task.clone(Object.assign(data, {id: localNewTaskId}));
    this._store.setItem(localNewTask.id, localNewTask.toRAW());

    return Promise.resolve(localNewTask);
  }

  updateTask(id, data) {
    if (isOnline()) {
      return this._api.updateTask(id, data)
        .then((newTask) => {
          this._store.setItem(newTask.id, newTask.toRAW());

          return newTask;
        });
    }

    const localTask = Task.clone(Object.assign(data, {id}));
    this._store.setItem(id, localTask.toRAW());

    return Promise.resolve(localTask);
  }

  deleteTask(id) {
    if (isOnline()) {
      return this._api.deleteTask(id)
        .then(() => this._store.removeItem(id));
    }

    this._store.removeItem(id);
    return Promise.resolve();
  }

  sync() {
    if (isOnline()) {
      const storeTasks = Object.values(this._store.getItems());
      return this._api.sync(storeTasks)
        .then((response) => {
          const createdTasks = getSyncedTasks(response.created);
          const updateTasks = getSyncedTasks(response.updated);

          const items = createStoreStructure([...createdTasks, ...updateTasks]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
