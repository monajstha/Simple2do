import Project from "./project/project";
import Task from "./task/task";
import User from "./user/user";
import { format } from "date-fns";
import "./styles.css";

const contentDiv = document.querySelector("#content");
const projectsDiv = document.querySelector("#projects");
const infoViewDiv = document.querySelector("#infoView");

const user = new User("Manoj Shrestha");

function taskRenderController() {
  let activeProject = user.getAllProjects()[0];

  const switchActiveProject = (project) => {
    activeProject = project;
  };

  const getActiveProject = () => {
    return activeProject;
  };

  const renderActiveTasks = () => {
    let allTasks = "";
    if (activeProject?.tasks?.length) {
      allTasks = activeProject?.tasks?.map((item) => {
        // console.log("inside", item);
        return `<div>${item.title}</div>`;
      });
    } else {
      allTasks = "Click on Add task to add tasks!";
    }
    infoViewDiv.innerHTML = allTasks;
    contentDiv.append(infoViewDiv);
  };
  return {
    switchActiveProject,
    getActiveProject,
    renderActiveTasks,
  };
}

function projectsRenderController() {
  const task = taskRenderController();

  const handleProjectClick = (item) => {
    infoViewDiv.innerHTML = "";
    task.switchActiveProject(item);
    task.renderActiveTasks();
  };

  const renderProjects = () => {
    projectsDiv.textContent = "";
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
    handleProjectClick,
  };
}

function taskActionController() {
  const taskRender = taskRenderController();

  const dialog = document.querySelector("#newTaskDialog");
  const addTaskBtn = document.querySelector("#addTaskBtn"); // Uncommented this line
  const closeBtn = document.querySelector("#taskDialogCloseBtn");
  const addNewTaskBtn = document.querySelector("#addNewTaskBtn");

  addTaskBtn.addEventListener("click", () => {
    displayModal();
  });

  closeBtn.addEventListener("click", () => {
    closeModal();
  });

  addNewTaskBtn.addEventListener("click", () => {
    addNewTask();
  });

  const displayModal = () => {
    console.log("opened");
    dialog.showModal(); // Open the dialog when the button is clicked
  };

  const closeModal = () => {
    console.log("closed");
    dialog.close(); // Close the dialog when the close button is clicked
  };

  const addNewTask = () => {
    let task = {};
    const form = document.getElementById("addNewTaskForm");
    let data = new FormData(form);
    for (let [key, value] of data) {
      console.log({ value });
      task = {
        ...task,
        [key]: value,
      };
    }
    console.log({ task });
    user.addTaskToProject(task.project, task);
    console.log("User after project add", user);
    let selectedProject = user
      .getAllProjects()
      .find((item) => item?.title === task.project);
    taskRender.switchActiveProject(selectedProject);
    closeModal();
    form.reset();
    taskRender.renderActiveTasks();
  };

  // Populate select in add task form
  const getAllProjectsForSelect = () => {
    const optGroup = document.querySelector("#projectOptionGroup");
    const options = user.getAllProjects().map((project) => {
      console.log({ project });
      return `<option value=${project.title}>${project.title}</option>`;
    });
    optGroup.innerHTML = options;
    console.log(optGroup);
  };
  // Initial project select load for add task form
  getAllProjectsForSelect();
  return {
    getActiveProject: taskRender.getActiveProject,
    switchActiveProject: taskRender.switchActiveProject,
    getAllProjectsForSelect,
  };
}

function projectActionController() {
  const projectRender = projectsRenderController();
  const taskAction = taskActionController();
  const dialog = document.querySelector("#newProjectDialog");
  const addProjectBtn = document.querySelector("#addProjectBtn"); // Uncommented this line
  const closeBtn = document.querySelector("#closeBtn");
  const addNewProjectBtn = document.querySelector("#addNewProjectBtn");

  addProjectBtn.addEventListener("click", () => {
    displayModal();
  });

  closeBtn.addEventListener("click", () => {
    closeModal();
  });

  addNewProjectBtn.addEventListener("click", () => {
    addNewProject();
  });

  const displayModal = () => {
    console.log("opened");
    dialog.showModal(); // Open the dialog when the button is clicked
  };

  const closeModal = () => {
    console.log("closed");
    dialog.close(); // Close the dialog when the close button is clicked
  };

  const addNewProject = () => {
    let project = {};
    const form = document.getElementById("addNewProjectForm");
    let data = new FormData(form);
    let requiredKeys = ["title", "description"];
    let i = 0;
    for (let [key, value] of data) {
      if (key === requiredKeys[i] && value === "") {
        alert("Please fill the title and description!");
        return;
      }
      project = {
        ...project,
        [key]: value,
      };
      i++;
    }
    user.addProject(project);
    taskAction.switchActiveProject(project);
    closeModal();
    form.reset();
    // render project after it is added
    projectRender.renderProjects();
    taskAction.getAllProjectsForSelect();
  };
}

function projectController() {
  // const taskAction = taskActionController();
  const projectAction = projectActionController();
  // const projectRender = projectsRenderController();
}

projectController();

console.log({ user });

// projectsRenderController();
