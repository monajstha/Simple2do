import Project from "./project/project";
import Task from "./task/task";
import User from "./user/user";
import { format } from "date-fns";
import "./styles.css";

const contentDiv = document.querySelector("#content");
const projectsListingDiv = document.querySelector("#projects");
projectsListingDiv.id = "projectsListingDiv";
const infoViewDiv = document.querySelector("#infoView");

const user = new User("Manoj Shrestha");
const project = new Project(
  1,
  "Project 1",
  "This is a project",
  "High",
  "2024-08-25",
  false
);
const task = new Task(
  1,
  1,
  "Task 1",
  "This is a task 1 of first project",
  "High",
  "2024-08-24",
  false
);
user.addProject(project);
user.addTaskToProject(project.id, task);

function taskRenderController() {
  const projectViewDiv = document.createElement("div");
  const taskCardWrapper = document.createElement("div");
  taskCardWrapper.id = "taskCardWrapper";
  projectViewDiv.id = "projectViewDiv";

  const projects = user.getAllProjects();
  let activeProjectId = projects[0]?.id;

  const switchActiveProjectId = (projectId) => {
    activeProjectId = projectId;
  };

  const getActiveProjectId = () => {
    return activeProjectId;
  };

  const taskCardRender = (tasks) => {
    taskCardWrapper.innerHTML = "";
    if (tasks.length) {
      // const taskCard = document.createElement("div");
      // taskCard.id = "taskCard";
      let taskCardContent = tasks?.map((task) => {
        const taskCard = document.createElement("div");
        taskCard.id = "taskCard";
        taskCard.innerHTML = `
            <div id="taskInfoWrapper">
            <input id="taskCheckbox" type="checkbox" value=${task.completed} >
            <div id="taskContentDiv">
              <div id="taskTitle">${task.title}</div>
              <div>Due Date: ${task.due_date}</div>
            </div>
            </div>
            <button id="deleteBtn">Delete</button>
          `;
        taskCard.style.borderColor =
          task?.priority.toLowerCase() === "high"
            ? "#ff0000"
            : task.priority === "medium"
            ? "#004e92"
            : "#1a9b11";
        taskCardWrapper.append(taskCard);
      });
      // taskCardWrapper.append(taskCardContent);
    } else {
      taskCardWrapper.innerHTML = "Click on Add task to add tasks!";
    }
  };

  const projectViewRender = () => {
    infoViewDiv.textContent = "";
    const activeProject = projects.find((item) => item.id === activeProjectId);
    taskCardRender(activeProject?.tasks);
    projectViewDiv.innerHTML = `<div>
      <div>
        <h2>${activeProject?.title}</h2>
        <p>${activeProject?.description}</p>
      </div>
      <div>
        <h3 id="tasksHeader">Tasks</h3>
      </div>
    </div>`;
    projectViewDiv.append(taskCardWrapper);
  };

  const renderActiveTasks = () => {
    projectViewRender();
    infoViewDiv.append(projectViewDiv);
    contentDiv.append(infoViewDiv);
  };

  return {
    switchActiveProjectId,
    getActiveProjectId,
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
    projectsListingDiv.textContent = "";
    let allProjects = user.getAllProjects().map((item, index) => {
      const projectListingCard = document.createElement("div");
      projectListingCard.id = `projectListingCard`;
      projectListingCard.addEventListener("click", () => {
        handleProjectClick(item?.id);
        // Reset the background color
        document.querySelectorAll("#projectListingCard").forEach((card) => {
          card.style.backgroundColor = "rgb(101, 98, 98)";
        });
        projectListingCard.style.backgroundColor = "rgba(51, 170, 51, 0.7)";
      });
      // Render tasks on initial load
      task.renderActiveTasks();
      projectListingCard.textContent = `#${item.title}`;

      // Set the initial background color
      projectListingCard.style.backgroundColor =
        item?.id === task.getActiveProjectId()
          ? "rgba(51, 170, 51, 0.7)"
          : "rgb(101, 98, 98)";

      projectsListingDiv.append(projectListingCard);
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
