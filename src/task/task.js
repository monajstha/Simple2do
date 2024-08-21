import Project from "../project/project";

class Task extends Project {
  constructor(id, title, description, priority, due_date, completed = false) {
    super(id, title, description, priority, due_date, completed);

    delete this.tasks;
  }
}

export default Task;
