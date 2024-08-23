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
      format(new Date(), "MM/dd/yyyy hh:mm:ss"),
      project.title,
      project.description,
      project.priority,
      project.due_date
    );
    console.log({ projectObj });
    this.projects.push(projectObj);
  }

  addTaskToProject(project, task) {
    this.projects.map((item) => {
      if (item?.title === project) {
        const taskObj = new Task(
          format(new Date(), "MM/dd/yyyy hh:mm:ss"),
          task.title,
          task.description,
          task.priority,
          task.due_date
        );
        item.tasks.push(taskObj);
        return;
      }
    });
  }

  getAllProjects() {
    // console.log(this.projects);
    return this.projects;
  }
}

export default User;
