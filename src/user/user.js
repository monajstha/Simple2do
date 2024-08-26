import Project from "../project/project";
import { format } from "date-fns";
import Task from "../task/task";

class User {
  constructor(name = "User", projects = []) {
    this.name = name;
    this.projects = projects;
  }

  addProject(project) {
    if (!project instanceof Project) return;

    console.log("Add project instance?", project instanceof Project);
    this.projects.push(project);
  }

  addTaskToProject(task) {
    if (!task instanceof Task) return;
    const selectedProject = this.projects.find(
      (item) => item.id === +task.projectId
    );
    console.log("Task instance? ", task instanceof Task);
    selectedProject.addTask(task);
  }

  getAllProjects() {
    // console.log(this.projects);
    return this.projects;
  }
}

export default User;
