class User {
  constructor(name = "User", projects = []) {
    this.name = name;
    this.projects = projects;
  }

  addProject(project) {
    this.projects.push(project);
  }

  addTaskToProject(project, task) {
    this.projects.map((item) => {
      if (item?.title === project) {
        console.log({ project, task });
        item.tasks.push(task);
      }
    });
  }

  getAllProjects() {
    return this.projects;
  }
}

export default User;
