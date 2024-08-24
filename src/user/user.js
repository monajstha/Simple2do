import Project from "../project/project";
import { format } from "date-fns";
import Task from "../task/task";

class User {
  constructor(name = "User", projects = []) {
    this.name = name;
    this.projects = projects;
  }

  addProject(project) {
    const projectObj = new Project(
      project.id,
      project.title,
      project.description,
      project.priority,
      project.due_date
    );
    this.projects.push(projectObj);
  }

  addTaskToProject(projectId, task) {
    console.log({ projectId }, { task });
    this.projects.map((item) => {
      console.log("Project", item);
      if (item?.id === +projectId) {
        const taskObj = new Task(
          item?.tasks?.length + 1,
          +task.projectId,
          task.title,
          task.description,
          task.priority,
          task.due_date
        );
        item.tasks.push(taskObj);
        console.log({ item });
        // return;
      }
    });
  }

  getAllProjects() {
    // console.log(this.projects);
    return this.projects;
  }
}

export default User;
