class Project {
  constructor(
    id,
    title,
    description,
    priority,
    due_date,
    completed = "incomplete",
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

  setProjectStatus() {
    this.completed = !this.completed;
  }

  updateTaskStatus(id) {
    this.tasks?.map((item) => {
      if (item?.id === id) {
        item.completed = !item.completed;
      }
    });
    console.log(this.tasks);
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
    console.log({ taskId });
    this.tasks = this.tasks.filter((item) => item?.id !== taskId);
  }
}

export default Project;
