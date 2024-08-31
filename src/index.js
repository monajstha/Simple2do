import Project from "./project/project";
import Task from "./task/task";
import User from "./user/user";
import { format } from "date-fns";
import "./styles.css";

const contentDiv = document.querySelector("#content");
const projectsListingDiv = document.querySelector("#projects");
projectsListingDiv.id = "projectsListingDiv";
const infoViewDiv = document.querySelector("#infoView");

const helloProject = new Project(
  1,
  "Hello",
  "Welcome to Simple2do",
  "High",
  format(new Date(), "yyyy-MM-dd"),
  false
);
const helloTask = new Task(
  1,
  1,
  "First Task",
  "This is the description of the task! Click on me to Edit :)",
  "High",
  format(new Date(), "yyyy-MM-dd"),
  false,
  "I am a note of this task! Click on me to edit :)"
);
console.log({ helloProject }, { helloTask });

const storedUser = JSON.parse(localStorage.getItem("user"));
let user;
if (storedUser) {
  user = new User(storedUser.name);
  storedUser.projects.forEach((project) => {
    const restoredProject = new Project(
      project.id,
      project.title,
      project.description,
      project.priority,
      project.due_date,
      project.completed
    );
    user.addProject(restoredProject);

    if (project.tasks) {
      project.tasks.forEach((task) => {
        const restoredTask = new Task(
          task.id,
          task.projectId,
          task.title,
          task.description,
          task.priority,
          task.due_date,
          task.completed,
          task?.taskNote
        );
        user.addTaskToProject(restoredTask);
      });
    }
  });
} else {
  user = new User("User 1");
  user.addProject(helloProject);
  helloProject.addTask(helloTask);
  localStorage.setItem("user", JSON.stringify(user));
}

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
    const activeProject = projects.find(
      (project) => project.id === getActiveProjectId()
    );

    if (!activeProject) return;

    activeProject.updateTaskStatus(taskId);
    localStorage.setItem("user", JSON.stringify(user));
    taskCardRender(activeProject.getAllTasks());
  };

  const taskCardRender = (tasks) => {
    taskCardWrapper.innerHTML = "";
    if (tasks?.length) {
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
                <div>
                <div>Due Date: ${task.due_date}</div>
                </div>
              </div>
            </div>
            <button id="deleteTaskBtn">Delete</button>
          `;
        taskCard.style.borderLeftWidth = "16px";
        taskCard.style.borderStyle = "solid";
        taskCard.style.borderColor =
          task?.priority.toLowerCase() === "high"
            ? "#ff0000"
            : task.priority.toLowerCase() === "medium"
            ? "#f6ff00"
            : " #002fff";

        const taskContentDiv = taskCard.querySelector("#taskContentDiv");
        taskContentDiv.addEventListener("click", () => {
          renderActiveTaskDetails(task.id);
        });

        // Add event listener to the delete button
        const deleteTaskBtn = taskCard.querySelector("#deleteTaskBtn");
        deleteTaskBtn.addEventListener("click", () => {
          deleteTask(task.id); // Call the deleteTask function when the button is clicked
          localStorage.setItem("user", JSON.stringify(user));
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
    const activeProject = projects.find((item) => item.id === +activeProjectId);
    taskCardRender(activeProject?.tasks);
    projectViewDiv.innerHTML = `<div>
    <div id="projectTitleWrapper">
      <div>
        <h2>${activeProject?.title}</h2>
        <p>${activeProject?.description}</p>
      </div>
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
    const options = user.getAllProjects().map((project) => {
      return `<option value=${project.id}>${project.title}</option>`;
    });
    optGroup.innerHTML = options;
  };

  const renderActiveTaskDetails = (taskId) => {
    const activeProject = projects.find((item) => item.id === +activeProjectId);
    const activeTask = activeProject.tasks.find((item) => item.id === +taskId);

    if (!activeTask) return;
    infoViewDiv.textContent = "";
    taskDetailsViewDiv.innerHTML = `
    <div id="backBtn"><-----</div>
    <div id="activeTaskDetails">
      <div id="activeTaskInfo">
        <div id="activeTaskTitleWrapper">
          <input id="taskStatusCheckbox" type="checkbox" name="completed" value=${
            activeTask.completed
          }" ${activeTask.completed ? "checked" : ""}>
          <div id="activeTaskInfoWrapper">
            <div id="activeTaskHeaderDiv">
              <h1 id="activeTaskTitle">${activeTask?.title}</h1>
            </div>
            <div id="activeTaskDescriptionDiv">
              <p id="activeTaskDescription">${activeTask?.description}</p>
            </div>
          </div>
      </div>
      <div id="taskNoteWrapper">
       <textarea id="taskNote" rows="10" cols="80" placeholder="Enter your note">${
         activeTask?.taskNote
       }</textarea>
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
          <div id="priorityCard"></div>
            <h4 id="activeTaskPriority">${activeTask?.priority}</h4>
          </div>
      </div>

        <div id="activeTaskKeyVal">
          <p>Due Date</p>
          <div id="activeTaskDueDateDiv">
            <h4 id="activeTaskDueDate">${activeTask?.due_date}</h4>
          </div>
        </div>

      <div id="activeTaskKeyVal">
      <p>Completed</p>
      <div id="activeTaskCompletedDiv">
        <h4 id="activeTaskCompleted">${
          activeTask?.completed ? "Yes" : "No"
        }</h4>
      </div>
      </div>
      <div>
    </div>
  `;
    const priorityCard = taskDetailsViewDiv.querySelector("#priorityCard");
    console.log(activeTask.priority);
    priorityCard.style.backgroundColor =
      activeTask.priority === "High"
        ? "#ff0000"
        : activeTask.priority === "Medium"
        ? "#f6ff00"
        : " #002fff";
    priorityCard.style.padding = "8px";
    priorityCard.style.marginRight = "4px";
    handleClickOnTaskDetails(taskId);
    infoViewDiv.append(taskDetailsViewDiv);
  };

  const handleClickOnTaskDetails = (taskId) => {
    const activeProject = projects.find((item) => item.id === +activeProjectId);
    const activeTask = activeProject.tasks.find((item) => item.id === +taskId);
    const taskAction = taskActionController();

    const taskCheckbox = taskDetailsViewDiv.querySelector(
      "#taskStatusCheckbox"
    );
    taskCheckbox.addEventListener("click", () => {
      activeProject.updateTaskStatus(activeTask.id);
      localStorage.setItem("user", JSON.stringify(user));
      renderActiveTaskDetails(taskId);
    });

    const backBtn = taskDetailsViewDiv.querySelector("#backBtn");
    backBtn.addEventListener("click", () => {
      // Previous view i.e. the project view
      renderActiveTasks(activeTask.id);
    });

    // Edit Task Title
    const activeTaskTitle =
      taskDetailsViewDiv.querySelector("#activeTaskTitle");
    activeTaskTitle.addEventListener("click", () => {
      taskAction.editInputTypeTaskDetails(
        activeTask.id,
        "title",
        "text",
        "#activeTaskTitle",
        "#activeTaskHeaderDiv"
      );
    });

    // Edit Task description
    const activeTaskDescription = taskDetailsViewDiv.querySelector(
      "#activeTaskDescription"
    );
    activeTaskDescription.addEventListener("click", () => {
      taskAction.editInputTypeTaskDetails(
        activeTask.id,
        "description",
        "text",
        "#activeTaskDescription",
        "#activeTaskDescriptionDiv"
      );
    });

    // Add Task Note
    const taskNoteWrapper =
      taskDetailsViewDiv.querySelector("#taskNoteWrapper");
    const taskNote = taskNoteWrapper.querySelector("#taskNote");
    let taskNoteClickCount = 0;
    taskNote.addEventListener("click", () => {
      if (taskNoteClickCount > 0) return;
      const buttonWrapper = document.createElement("div");
      buttonWrapper.id = "buttonWrapper";
      const saveBtn = document.createElement("button");
      saveBtn.id = "saveBtn";
      saveBtn.textContent = "Save";
      const cancelBtn = document.createElement("button");
      cancelBtn.id = "cancelBtn";
      cancelBtn.textContent = "Cancel";
      buttonWrapper.append(cancelBtn, saveBtn);
      taskNoteWrapper.append(buttonWrapper);
      taskNoteClickCount++;

      saveBtn.onclick = () => {
        activeProject.updateTaskDetails(
          activeTask.id,
          taskNote.id,
          taskNote.value
        );
        localStorage.setItem("user", JSON.stringify(user));
        taskNote.readOnly = true;
        taskNoteWrapper.removeChild(buttonWrapper);
        taskNoteClickCount = 0;
      };

      cancelBtn.onclick = () => {
        renderActiveTaskDetails(activeTask.id);
        taskNoteClickCount = 0;
      };
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
      const options = user.getAllProjects().map((project) => {
        let optionsStr = "";
        if (activeProject?.title === project.title) {
          optionsStr =
            optionsStr +
            `<option selected value=${project.id}>${project.title}</option>`;
        } else {
          optionsStr = `<option value=${project.id}>${project.title}</option>`;
        }
        return optionsStr;
      });
      optGroup.innerHTML = options;
      projectSelect.append(optGroup);
      activeTaskProjectTitle.textContent = "";

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
        activeTaskProjectTitle.textContent = newProjectTitle;
        activeTaskProjectTitleDiv.removeChild(projectSelect);
        // Update tasks if any update has been made
        user.updateTasks(activeTask);
        localStorage.setItem("user", JSON.stringify(user));
        const msgDialog = document.querySelector("#projectUpdatedDialog");
        const dialogTitle = document.querySelector("#dialogTitle");
        dialogTitle.textContent = `Task switched to ${newProjectTitle}`;
        const dialogMessage = document.querySelector("#dialogMessage");
        dialogMessage.textContent = `Your task ${activeTask.title} has been switched to ${newProjectTitle} from ${activeProject.title}`;
        msgDialog.showModal();
        const dialogOkBtn = document.querySelector("#dialogOkBtn");
        dialogOkBtn.addEventListener("click", () => {
          msgDialog.close();
          const projectRender = projectsRenderController();
          projectRender.handleProjectClick(e.target.value);
          projectRender.renderProjects();
        });
      };
    });

    // Edit Task Priority
    const activeTaskPriority = taskDetailsViewDiv.querySelector(
      "#activeTaskPriority"
    );
    activeTaskPriority.addEventListener("click", () => {
      const prioritySelect = document.createElement("select");
      prioritySelect.id = "projectId";
      const optGroup = document.createElement("optgroup");
      optGroup.id = "projectOptionGroup";
      const options = ["High", "Medium", "Low"].map((priority) => {
        let optionsStr = "";
        if (activeTask?.priority === priority) {
          optionsStr =
            optionsStr +
            `<option selected value=${priority}>${priority}</option>`;
        } else {
          optionsStr = `<option value=${priority}>${priority}</option>`;
        }
        return optionsStr;
      });
      optGroup.innerHTML = options;
      prioritySelect.append(optGroup);

      activeTaskPriority.textContent = "";

      // const prioritySelect = document.querySelector("#projectId");
      const activeTaskPriorityDiv = document.querySelector(
        "#activeTaskPriorityDiv"
      );
      activeTaskPriorityDiv.append(prioritySelect);
      prioritySelect.onchange = (e) => {
        activeProject.updateTaskDetails(
          activeTask.id,
          "priority",
          e.target.value
        );
        localStorage.setItem("user", JSON.stringify(user));
        const newProjectPriority =
          prioritySelect.options[prioritySelect.selectedIndex].text;
        activeTaskPriority.textContent = newProjectPriority;
        activeTaskPriorityDiv.removeChild(prioritySelect);
        const priorityCard = taskDetailsViewDiv.querySelector("#priorityCard");
        priorityCard.style.backgroundColor =
          activeTask.priority === "High"
            ? "#ff0000"
            : activeTask.priority === "Medium"
            ? "#f6ff00"
            : " #002fff";
      };
    });

    // Edit Task Due Date
    const activeTaskDueDate =
      taskDetailsViewDiv.querySelector("#activeTaskDueDate");
    activeTaskDueDate.addEventListener("click", () => {
      taskAction.editInputTypeTaskDetails(
        activeTask.id,
        "due_date",
        "date",
        "#activeTaskDueDate",
        "#activeTaskDueDateDiv"
      );
    });
  };

  return {
    switchActiveProjectId,
    getActiveProjectId,
    renderActiveTasks,
    getAllProjectsForSelect,
    renderActiveTaskDetails,
  };
}

function projectsRenderController() {
  const taskRender = taskRenderController();

  const handleProjectClick = (projectId) => {
    infoViewDiv.innerHTML = "";
    taskRender.switchActiveProjectId(projectId);
    taskRender.renderActiveTasks();
    document.querySelectorAll('[id^="projectListingCard_"]').forEach((card) => {
      card.style.backgroundColor = "rgb(101, 98, 98)";
      card.style.color = "#000";
      card.style.fontWeight = "normal";
    });
    const activeProjectCard = projectsListingDiv.querySelector(
      `#projectListingCard_${projectId}`
    );
    activeProjectCard.style.backgroundColor = "rgba(51, 170, 51, 0.7)";
    activeProjectCard.style.color = "#ffff";
    activeProjectCard.style.fontWeight = "bold";
  };

  const renderProjects = () => {
    projectsListingDiv.textContent = "";
    const storedUser = JSON.parse(localStorage.getItem("user"));
    let allProjects = storedUser?.projects.map((item, index) => {
      const projectListingCard = document.createElement("div");
      projectListingCard.id = `projectListingCard_${item.id}`;
      // Render tasks on initial load
      taskRender.renderActiveTasks();
      projectListingCard.textContent = `#${item.title}`;
      projectListingCard.style.padding = "10px 16px";
      projectListingCard.style.cursor = "pointer";

      // Set the initial background color
      projectListingCard.style.backgroundColor =
        item?.id === +taskRender.getActiveProjectId()
          ? "rgba(51, 170, 51, 0.7)"
          : "rgb(101, 98, 98)";
      projectListingCard.style.color =
        item?.id === +taskRender.getActiveProjectId() ? "#fff" : "#000";
      projectListingCard.style.fontWeight =
        item?.id === +taskRender.getActiveProjectId() ? "bold" : "normal";

      projectListingCard.addEventListener("click", () => {
        handleProjectClick(item?.id);
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
    dialog.showModal(); // Open the dialog when the button is clicked
  };

  const closeModal = () => {
    dialog.close(); // Close the dialog when the close button is clicked
  };

  const addNewTask = () => {
    let taskFormValue = {};
    const form = document.getElementById("addNewTaskForm");
    let data = new FormData(form);
    let requiredKeys = ["title", "description"];
    let i = 0;
    for (let [key, value] of data) {
      console.log({ key }, { value });
      if (key === requiredKeys[i] && value === "") {
        alert("Please fill the title and description!");
        return;
      }
      taskFormValue = {
        ...taskFormValue,
        [key]: value,
      };
      i++;
    }
    let selectedProject = user
      .getAllProjects()
      .find((item) => item.id === +taskFormValue.projectId);
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
    localStorage.setItem("user", JSON.stringify(user));
    taskRender.switchActiveProjectId(selectedProject?.id);
    taskRender.renderActiveTasks();
    document.querySelectorAll('[id^="projectListingCard_"]').forEach((card) => {
      card.style.backgroundColor = "rgb(101, 98, 98)";
      card.style.color = "#000";
      card.style.fontWeight = "normal";
    });
    const activeProjectCard = projectsListingDiv.querySelector(
      `#projectListingCard_${selectedProject.id}`
    );
    activeProjectCard.style.backgroundColor = "rgba(51, 170, 51, 0.7)";
    activeProjectCard.style.color = "#ffff";
    activeProjectCard.style.fontWeight = "bold";
    closeModal();
    form.reset();
  };

  const editInputTypeTaskDetails = (
    taskId,
    key,
    inputType,
    selectedDetail,
    selectedDetailDiv
  ) => {
    const activeProject = user
      .getAllProjects()
      .find((item) => item.id === +taskRender.getActiveProjectId());
    const activeTask = activeProject.tasks.find((item) => item.id === +taskId);
    const taskDetailsViewDiv = document.querySelector("#taskDetailsViewDiv");
    const selectedDetailElement =
      taskDetailsViewDiv.querySelector(selectedDetail);
    const selectedDetailElementDiv =
      taskDetailsViewDiv.querySelector(selectedDetailDiv);

    selectedDetailElement.textContent = "";
    const editTaskInfoDiv = document.createElement("div");
    const input = document.createElement("input");
    input.id = key;
    input.type = inputType;
    input.value = activeTask[key];
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
      selectedDetailElementDiv.textContent = "";
      if (!input.value) {
        alert("Please give this a title!");
        return;
      }
      activeProject.updateTaskDetails(activeTask.id, input.id, input.value);
      localStorage.setItem("user", JSON.stringify(user));
      selectedDetailElement.textContent = input.value;
      selectedDetailElementDiv.append(selectedDetailElement);
    };

    cancelBtn.onclick = () => {
      taskRender.renderActiveTaskDetails(activeTask.id);
    };

    editTaskInfoDiv.append(input, buttonWrapper);
    selectedDetailElementDiv.append(editTaskInfoDiv);
  };

  // Initial project select load for add task form
  taskRender.getAllProjectsForSelect();
  return {
    // getActiveProjectId: taskRender.getActiveProjectId,
    switchActiveProjectId: taskRender.switchActiveProjectId,
    getAllProjectsForSelect: taskRender.getAllProjectsForSelect,
    editInputTypeTaskDetails,
  };
}

function projectActionController() {
  const projectRender = projectsRenderController();
  const taskAction = taskActionController();
  const dialog = document.querySelector("#newProjectDialog");
  const addProjectBtn = document.querySelector("#addProjectBtn");
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
    dialog.showModal(); // Open the dialog when the button is clicked
  };

  const closeModal = () => {
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
    const project1 = new Project(
      projectFormValue.id,
      projectFormValue.title,
      projectFormValue.description,
      projectFormValue.priority,
      projectFormValue.due_date,
      projectFormValue.completed
    );
    user.addProject(project1);
    localStorage.setItem("user", JSON.stringify(user));
    closeModal();
    form.reset();
    // render project after it is added
    projectRender.renderProjects();
    projectRender.handleProjectClick(project1?.id);
    taskAction.getAllProjectsForSelect();
  };
}

function projectController() {
  const projectAction = projectActionController();
}

console.log("last user", { user });
projectController();
