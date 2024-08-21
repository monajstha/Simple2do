import Project from "./project/project";
import Task from "./task/task";
import User from "./user/user";
import { format } from "date-fns";
import "./styles.css";

const contentDiv = document.querySelector("#content");
const projectsDiv = document.querySelector("#projects");
const infoViewDiv = document.querySelector("#infoView");

const task = new Task(
  format(new Date(), "MM/dd/yyyy hh:mm:ss"),
  "Task 1",
  "I will complete!",
  "medium",
  "2024-08-12"
);
const project = new Project(
  format(new Date(), "MM/dd/yyyy hh:mm:ss"),
  "Project 1",
  "I will complete!",
  "high",
  "2024-09-03"
);
const project2 = new Project(
  format(new Date(), "MM/dd/yyyy hh:mm:ss"),
  "Project 2",
  "I will complete!",
  "high",
  "2024-09-03"
);
const project3 = new Project(1, "Project 3");

// console.log({ task });
project.addTask(task);
project.addTask({
  title: "Task 2",
});

task.setTitle("Task 22");
// project.deleteATask(task.title);
const user = new User("Manoj Shrestha");
user.addProject(project);
user.addProject(project2);
user.addProject(project3);

console.log({ user });
console.log({ project });
console.log(project.getAllTasks());

function taskController() {
  let activeProject = user.getAllProjects()[0];

  const switchActiveProject = (project) => {
    activeProject = project;
  };

  const getActiveProject = () => {
    return activeProject;
  };

  const renderActiveTasks = () => {
    let allTasks = activeProject.tasks.map((item) => {
      console.log("inside", item);
      return `<div>${item.title}</div>`;
    });
    infoViewDiv.innerHTML = allTasks;
    contentDiv.append(infoViewDiv);
  };
  return {
    switchActiveProject,
    getActiveProject,
    renderActiveTasks,
  };
}

function projectsController() {
  const task = taskController();

  const handleProjectClick = (item) => {
    infoViewDiv.innerHTML = "";
    task.switchActiveProject(item);
    task.renderActiveTasks();
  };

  const renderProjects = () => {
    let allProjects = user.getAllProjects().map((item, index) => {
      const projectName = document.createElement("p");
      projectName.addEventListener("click", () => handleProjectClick(item));
      // render tasks on initial load
      task.renderActiveTasks();
      projectName.textContent = `#${item.title}`;
      projectsDiv.append(projectName);
    });
  };

  // initial project load
  renderProjects();
  return {
    renderProjects,
  };
}

projectsController();
