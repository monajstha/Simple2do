class Project {
  constructor(
    id,
    title,
    description,
    priority,
    due_date,
    completed = false,
    tasks = []
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.due_date = due_date;
    this.completed = completed;
    this.tasks = tasks;
  }

  setTitle(title) {
    this.title = title;
  }

  setPriority(priority) {
    this.priority = priority;
  }

  setTaskStatus(completed) {
    this.completed = !completed;
  }

  setDescription(description) {
    this.description = description;
  }

  addTask(task) {
    this.tasks.push(task);
  }

  getAllTasks() {
    return this.tasks;
  }

  deleteATask(taskId) {
    this.tasks = this.tasks.filter((item) => item?.id !== taskId);
  }
}

export default Project;
