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
  const projects = user.getAllProjects();
  let activeProjectId = projects[0]?.id;

  const switchActiveProjectId = (projectId) => {
    activeProjectId = projectId;
  };

  const getActiveProjectId = () => {
    return activeProjectId;
  };

  const renderActiveTasks = () => {
    let allTasks = "";
    const activeProject = projects.find((item) => item.id === activeProjectId);
    console.log({ projects }, { activeProjectId }, { activeProject });
    allTasks = `<div><h2>${activeProject?.title}
    </h2>
    <p>${activeProject?.description}</p>
    ${
      activeProject?.tasks?.length
        ? activeProject?.tasks?.map((task) => `<div>${task.title}</div>`)
        : `Click on Add task to add tasks!`
    }
    </div>`;
    // if (activeProject?.tasks?.length) {
    //   allTasks = activeProject?.tasks?.map((item) => {
    //     console.log("inside", item);
    //     return `<div>${item.title}</div>`;
    //   });
    // } else {
    //   allTasks = "Click on Add task to add tasks!";
    // }
    infoViewDiv.innerHTML = allTasks;
    contentDiv.append(infoViewDiv);
  };
  return {
    switchActiveProjectId,
    // getActiveProjectId,
    renderActiveTasks,
  };
}

function projectsRenderController() {
  const task = taskRenderController();

  const handleProjectClick = (projectId) => {
    infoViewDiv.innerHTML = "";
    task.switchActiveProjectId(projectId);
    task.renderActiveTasks();
  };

  const renderProjects = () => {
    projectsDiv.textContent = "";
    let allProjects = user.getAllProjects().map((item, index) => {
      const projectName = document.createElement("p");
      projectName.addEventListener("click", () => handleProjectClick(item?.id));
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
  const addTaskBtn = document.querySelector("#addTaskBtn");
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
    user.addTaskToProject(task.projectId, task);
    console.log("User after project add", user);
    let selectedProject = user
      .getAllProjects()
      .find((item) => item?.id === +task.projectId);
    console.log({ selectedProject });
    taskRender.switchActiveProjectId(selectedProject?.id);
    taskRender.renderActiveTasks();
    closeModal();
    form.reset();
  };

  // Populate select in add task form
  const getAllProjectsForSelect = () => {
    const optGroup = document.querySelector("#projectOptionGroup");
    const options = user.getAllProjects().map((project) => {
      console.log({ project });
      return `<option value=${project.id}>${project.title}</option>`;
    });
    optGroup.innerHTML = options;
    console.log(optGroup);
  };
  // Initial project select load for add task form
  getAllProjectsForSelect();
  return {
    // getActiveProjectId: taskRender.getActiveProjectId,
    switchActiveProjectId: taskRender.switchActiveProjectId,
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
    let project = {
      id: user.getAllProjects().length + 1,
    };
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
    projectRender.handleProjectClick(project?.id);
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
