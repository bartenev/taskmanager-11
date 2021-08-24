import SiteMenuComponent from './components/site-menu.js';
import FilterController from "./controllers/filter.js";
import BoardComponent from './components/board.js';
import BoardController from "./controllers/board";
import TasksModel from "./models/tasks.js";
import {generateTasks} from "./mock/task.js";
import {render} from "./utils/render.js";

const TASK_COUNT = 20;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
render(siteHeaderElement, new SiteMenuComponent());

const tasks = generateTasks(TASK_COUNT);
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const filterController = new FilterController(siteMainElement, tasksModel);
filterController.render();

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent);

const boardController = new BoardController(boardComponent, tasksModel);
boardController.render(tasks);
