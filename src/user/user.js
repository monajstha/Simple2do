class User {
  constructor(name = "User", projects = []) {
    this.name = name;
    this.projects = projects;
  }

  addProject(project) {
    this.projects.push(project);
  }

  getAllProjects() {
    return this.projects;
  }
}

export default User;
