import API from "./api";
import BoardComponent from './components/board.js';
import BoardController from "./controllers/board";
import FilterController from "./controllers/filter.js";
import Provider from "./api/provider";
import SiteMenuComponent, {MenuItem} from './components/site-menu.js';
import StatisticsComponent from "./components/statistics.js";
import Store from "./api/store";
import TasksModel from "./models/tasks.js";
import {render} from "./utils/render.js";

const AUTHORIZATION = `Basic dhf;ziofliudgspuf`;
const END_POINT = `https://11.ecmascript.pages.academy/task-manager`;

const dateTo = new Date();
const dateFrom = (() => {
  const d = new Date(dateTo);
  d.setDate(d.getDate() - 7);
  return d;
})();

const api = new API(END_POINT, AUTHORIZATION);
const store = new Store();
const apiWithProvider = new Provider(api, store);
const tasksModel = new TasksModel();

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const siteMenuComponent = new SiteMenuComponent();
const filterController = new FilterController(siteMainElement, tasksModel);
const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent, tasksModel, apiWithProvider);
const statisticsComponent = new StatisticsComponent({tasks: tasksModel, dateFrom, dateTo});

render(siteHeaderElement, siteMenuComponent);
filterController.render();
render(siteMainElement, boardComponent);
render(siteMainElement, statisticsComponent);
statisticsComponent.hide();

siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      siteMenuComponent.setActiveItem(MenuItem.TASKS);
      statisticsComponent.hide();
      boardController.show();
      boardController.createTask();
      break;
    case MenuItem.STATISTICS:
      boardController.hide();
      statisticsComponent.show();
      break;
    case MenuItem.TASKS:
      statisticsComponent.hide();
      boardController.show();
      break;
  }
});

apiWithProvider.getTasks()
  .then((tasks) => {
    console.log(tasks);
    tasksModel.setTasks(tasks);
    boardController.render();
  });


