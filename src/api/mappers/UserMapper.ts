export class UserMapper {
  getUser (user) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      middlename: user.middlename,
      age: user.age,
      state: user.state,
    }
  }
}