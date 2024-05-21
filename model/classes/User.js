class User {
  constructor(storedUser) {
    this._id = storedUser._id;
    this.name = storedUser.name;
    this.username = storedUser.username;
    this.isAdmin = storedUser.isAdmin;
    this.isTeacher = storedUser.isTeacher;
    this.location = storedUser.location;
    this.pronouns = storedUser.pronouns;
    this.creationDate = storedUser.creationDate;
    this.lastLogin = storedUser.lastLogin;
    this.hoursPlayed = storedUser.hoursPlayed;
    this.description = storedUser.description;
    this.characters = storedUser.characters;
    this.students = storedUser.students;
  }

  //TODO - are there any properties that aren't stored?
  //TODO - add methods for user actions
  
  }

  export default User;