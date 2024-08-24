import Project from "../project/project";

class Task extends Project {
  constructor(
    id,
    projectId,
    title,
    description,
    priority,
    due_date,
    completed = false
  ) {
    super(id, title, description, priority, due_date, completed);
    this.projectId = projectId;

    delete this.tasks;
  }
}

export default Task;
