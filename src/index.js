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
const project2 = new Project(
  2,
  "Project 2",
  "This is a project 2",
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
const task2 = new Task(
  2,
  1,
  "Task 2",
  "This is a task 1 of first project",
  "High",
  "2024-08-24",
  false
);

const task3 = new Task(
  3,
  1,
  "Task 3",
  "This is a task 1 of first project",
  "High",
  "2024-08-24",
  false
);

user.addProject(project);
user.addProject(project2);
user.addTaskToProject(task);
user.addTaskToProject(task2);
console.log(project.getAllTasks());
// project.deleteATask(task.id);
// user.addTaskToProject(project.id, task2);
// user.addingTask(project, task3);
console.log(project.getAllTasks());
console.log(user);

function taskRenderController() {
  const taskDetailsViewDiv = document.createElement("div");
  taskDetailsViewDiv.id = "taskDetailsViewDiv";
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

  const deleteTask = (taskId) => {
    // Find the project that contains this task
    const activeProject = projects.find(
      (project) => project.id === getActiveProjectId()
    );

    if (activeProject) {
      activeProject.deleteATask(taskId);
      taskCardRender(activeProject.getAllTasks());
    }
  };

  const handleTaskCheckboxToggle = (taskId) => {
    console.log("toggled!!");
    const activeProject = projects.find(
      (project) => project.id === getActiveProjectId()
    );

    if (!activeProject) return;

    activeProject.updateTaskStatus(taskId);
    taskCardRender(activeProject.getAllTasks());
    console.log(activeProject.getAllTasks());
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
              <input id="taskCheckbox" type="checkbox" name="completed" value=${
                task.completed
              }" ${task.completed ? "checked" : ""}>
              <div id="taskContentDiv">
                <div id="taskTitle">${task.title}</div>
                <div>Due Date: ${task.due_date}</div>
              </div>
            </div>
            <button id="deleteTaskBtn">Delete</button>
          `;
        taskCard.style.borderColor =
          task?.priority.toLowerCase() === "high"
            ? "#ff0000"
            : task.priority === "medium"
            ? "#004e92"
            : "#1a9b11";

        const taskContentDiv = taskCard.querySelector("#taskContentDiv");
        taskContentDiv.addEventListener("click", () => {
          renderActiveTaskDetails(task.id);
        });

        // Add event listener to the delete button
        const deleteTaskBtn = taskCard.querySelector("#deleteTaskBtn");
        deleteTaskBtn.addEventListener("click", () => {
          deleteTask(task.id); // Call the deleteTask function when the button is clicked
        });

        // Add event listener to the checkbox
        const taskCheckbox = taskCard.querySelector("#taskCheckbox");
        taskCheckbox.addEventListener("click", () => {
          handleTaskCheckboxToggle(task.id);
        });

        taskCardWrapper.append(taskCard);
      });
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

  // Populate select options in add task form
  const getAllProjectsForSelect = () => {
    const optGroup = document.querySelector("#projectOptionGroup");
    console.log({ optGroup });
    const options = user.getAllProjects().map((project) => {
      console.log({ project });
      return `<option value=${project.id}>${project.title}</option>`;
    });
    optGroup.innerHTML = options;
    console.log(optGroup);
  };

  const renderEditPrioritySelect = () => {
    const prioritySelect = document.createElement("select");
    prioritySelect.id = "prioritySelect";
    const optGroup = document.createElement("optgroup");
    optGroup.id = "priorityOptionGroup";
    const options = ["High", "Medium", "Low"].map((item) => {
      return `<option value=${item}>${item}</option>`;
    });
    prioritySelect.append(optGroup);
  };

  const handleEditPriority = () => {
    const activeTaskPriority = document.querySelector("#activeTaskPriority");
    const prioritySelect = document.querySelector("#prioritySelect");
    activeTaskPriority.textContent = "";
    const activeTaskPrioirtyDiv = document.querySelector(
      "#activeTaskPrioirtyDiv"
    );
    activeTaskPrioirtyDiv.append(prioritySelect);
    // prioritySelect.onchange((e) => {
    //   activeProject.updateTaskDetails(
    //     activeTask.id,
    //     "projectId",
    //     e.target.value
    //   );
    //   const newProjectTitle =
    //     projectSelect.options[projectSelect.selectedIndex].text;
    //   console.log("text?", newProjectTitle);
    //   activeTaskPriority.textContent = newProjectTitle;
    //   activeTaskPrioirtyDiv.removeChild(renderEditPrioritySelect());
    // });
  };

  const renderActiveTaskDetails = (taskId) => {
    const activeProject = projects.find((item) => item.id === +activeProjectId);
    const activeTask = activeProject.tasks.find((item) => item.id === +taskId);
    // console.log({ activeTask });

    if (!activeTask) return;
    infoViewDiv.textContent = "";
    taskDetailsViewDiv.innerHTML = `
    <button id="backBtn">Back</button>
    <div id="activeTaskDetails">
      <div id="activeTaskInfo">
          <div id="activeTaskHeaderDiv">
            <h1 id="activeTaskTitle">${activeTask?.title}</h1>
          </div>

          <div id="activeTaskDescriptionDiv">
            <p id="activeTaskDescription">${activeTask?.description}</p>
          </div>
      </div>
    
      <div id="activeProjectInfo">
        <div id="activeTaskProject">
          <p>Project</p>
          <div id="activeTaskProjectTitleDiv">
            <h4 id="activeTaskProjectTitle">  ${activeProject.title}</h4>

          </div>
        </div>

        <div id="activeTaskKeyVal">
          <p>Priority</p>
          <div id="activeTaskPriorityDiv">
            <h4 id="activeTaskPriority">${activeTask?.priority}</h4>
          </div>
      </div>

        <div id="activeTaskKeyVal">
          <p>Due Date</p>
          <h4>${activeTask?.due_date}</h4>
        </div>

      <div id="activeTaskKeyVal">
      <p>Completed</p>
      <h4>${activeTask?.completed ? "Yes" : "No"}</h4>
      </div>
      <div>
    </div>
  `;
    renderEditPrioritySelect();

    const backBtn = taskDetailsViewDiv.querySelector("#backBtn");
    backBtn.addEventListener("click", () => {
      // Previous view i.e. the project view
      renderActiveTasks();
    });

    // Edit Task Title
    const activeTaskTitle =
      taskDetailsViewDiv.querySelector("#activeTaskTitle");
    activeTaskTitle.addEventListener("click", () => {
      editTaskDetailDiv(
        activeTask.id,
        "title",
        "#activeTaskTitle",
        "#activeTaskHeaderDiv"
      );
    });

    // Edit Task description
    const activeTaskDescription = taskDetailsViewDiv.querySelector(
      "#activeTaskDescription"
    );
    activeTaskDescription.addEventListener("click", () => {
      editTaskDetailDiv(
        activeTask.id,
        "description",
        "#activeTaskDescription",
        "#activeTaskDescriptionDiv"
      );
    });

    // Edit Task Project Id/Title
    const activeTaskProjectTitle = taskDetailsViewDiv.querySelector(
      "#activeTaskProjectTitle"
    );

    activeTaskProjectTitle.addEventListener("click", () => {
      const projectSelect = document.createElement("select");
      projectSelect.id = "projectId";
      const optGroup = document.createElement("optgroup");
      optGroup.id = "projectOptionGroup";
      console.log({ optGroup });
      const options = user.getAllProjects().map((project) => {
        console.log({ project });
        return `<option value=${project.id}>${project.title}</option>`;
      });
      optGroup.innerHTML = options;
      projectSelect.append(optGroup);

      activeTaskProjectTitle.textContent = "";

      // const projectSelect = document.querySelector("#projectId");
      const activeTaskProjectTitleDiv = document.querySelector(
        "#activeTaskProjectTitleDiv"
      );
      activeTaskProjectTitleDiv.append(projectSelect);
      projectSelect.onchange = (e) => {
        activeProject.updateTaskDetails(
          activeTask.id,
          "projectId",
          e.target.value
        );
        const newProjectTitle =
          projectSelect.options[projectSelect.selectedIndex].text;
        console.log("text?", newProjectTitle);
        activeTaskProjectTitle.textContent = newProjectTitle;
        activeTaskProjectTitleDiv.removeChild(projectSelect);
        console.log({ activeTask });
        // Update tasks if any update has been made
        user.updateTasks(activeTask);
      };
    });

    // const projectSelectElement = document.getElementById("projectId");
    // projectSelectElement?.addEventListener("selectionchange", () => {
    //   const projectSelectValue = projectSelectElement.value;
    //   // console.log({ projectSelectElement }, { projectSelectValue });
    // });

    const activeTaskPriority = document.getElementById("activeTaskPriority");
    console.log({ activeTaskPriority });
    // activeTaskPriority.addEventListener("click", () => {
    //   handleEditPriority();
    // });

    infoViewDiv.append(taskDetailsViewDiv);
  };

  const editTaskDetailDiv = (
    taskId,
    key,
    selectedDetail,
    selectedDetailDiv
  ) => {
    const activeProject = projects.find((item) => item.id === +activeProjectId);
    const activeTask = activeProject.tasks.find((item) => item.id === +taskId);
    const activeTaskTitle = taskDetailsViewDiv.querySelector(selectedDetail);

    activeTaskTitle.textContent = "";
    const activeTaskHeaderDiv =
      taskDetailsViewDiv.querySelector(selectedDetailDiv);

    const editTaskInfoDiv = document.createElement("div");
    const input = document.createElement("input");
    input.id = key;
    input.type = "text";
    input.value = activeTask[key];
    input.onchange = (text) => {
      console.log("Text", text);
    };
    input.autofocus;

    const buttonWrapper = document.createElement("div");
    buttonWrapper.id = "buttonWrapper";
    const saveBtn = document.createElement("button");
    saveBtn.id = "saveBtn";
    saveBtn.textContent = "Save";
    const cancelBtn = document.createElement("button");
    cancelBtn.id = "cancelBtn";
    cancelBtn.textContent = "Cancel";
    buttonWrapper.append(cancelBtn, saveBtn);

    saveBtn.onclick = () => {
      activeTaskHeaderDiv.textContent = "";
      activeProject.updateTaskDetails(activeTask.id, input.id, input.value);
      activeTaskTitle.textContent = input.value;
      activeTaskHeaderDiv.append(activeTaskTitle);
    };

    cancelBtn.onclick = () => {
      renderActiveTaskDetails(activeTask.id);
    };

    editTaskInfoDiv.append(input, buttonWrapper);
    activeTaskHeaderDiv.append(editTaskInfoDiv);
  };

  // getAllProjectsForSelect();

  return {
    switchActiveProjectId,
    getActiveProjectId,
    renderActiveTasks,
    getAllProjectsForSelect,
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
      // Render tasks on initial load
      task.renderActiveTasks();
      projectListingCard.textContent = `#${item.title}`;

      // Set the initial background color
      projectListingCard.style.backgroundColor =
        item?.id === task.getActiveProjectId()
          ? "rgba(51, 170, 51, 0.7)"
          : "rgb(101, 98, 98)";

      projectListingCard.addEventListener("click", () => {
        handleProjectClick(item?.id);
        // Reset the background color for all cards
        document.querySelectorAll("#projectListingCard").forEach((card) => {
          card.style.backgroundColor = "rgb(101, 98, 98)";
        });
        projectListingCard.style.backgroundColor = "rgba(51, 170, 51, 0.7)";
      });

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
    let taskFormValue = {};
    const form = document.getElementById("addNewTaskForm");
    let data = new FormData(form);
    for (let [key, value] of data) {
      console.log({ value });
      taskFormValue = {
        ...taskFormValue,
        [key]: value,
      };
    }
    let selectedProject = user
      .getAllProjects()
      .find((item) => item.id === +taskFormValue.projectId);
    console.log({ selectedProject });
    const task = new Task(
      selectedProject?.tasks.length + 1,
      taskFormValue.projectId,
      taskFormValue.title,
      taskFormValue.description,
      taskFormValue.priority,
      taskFormValue.due_date,
      taskFormValue.completed
    );
    user.addTaskToProject(task);
    taskRender.switchActiveProjectId(selectedProject?.id);
    taskRender.renderActiveTasks();
    closeModal();
    form.reset();
  };

  // Initial project select load for add task form
  taskRender.getAllProjectsForSelect();
  return {
    // getActiveProjectId: taskRender.getActiveProjectId,
    switchActiveProjectId: taskRender.switchActiveProjectId,
    getAllProjectsForSelect: taskRender.getAllProjectsForSelect,
  };
}

function projectActionController() {
  const projectRender = projectsRenderController();
  const taskAction = taskActionController();
  const dialog = document.querySelector("#newProjectDialog");
  const addProjectBtn = document.querySelector("#addProjectBtn");
  const closeBtn = document.querySelector("#closeBtn");
  const addNewProjectBtn = document.querySelector("#addNewProjectBtn");
  const deleteTaskBtn = document.querySelector("#deleteTaskBtn");

  // deleteTaskBtn.addEventListener("click", () => {});

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
    let projectFormValue = {
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
      projectFormValue = {
        ...projectFormValue,
        [key]: value,
      };
      i++;
    }
    const project = new Project(
      projectFormValue.id,
      projectFormValue.title,
      projectFormValue.description,
      projectFormValue.priority,
      projectFormValue.due_date,
      projectFormValue.completed
    );
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
  const projectAction = projectActionController();
}

projectController();

console.log({ user });
