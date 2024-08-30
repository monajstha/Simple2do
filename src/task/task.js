import Project from "../project/project";

class Task extends Project {
  constructor(
    id,
    projectId,
    title,
    description,
    priority,
    due_date,
    completed = false,
    taskNote = ""
  ) {
    super(id, title, description, priority, due_date, completed);
    this.projectId = projectId;
    this.taskNote = taskNote;

    delete this.tasks;
  }

  setTaskNote(note) {
    this.taskNote = note;
  }
}

export default Task;
