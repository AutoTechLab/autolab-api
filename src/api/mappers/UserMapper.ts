import { User } from "../schemas/UserShema";

export class UserMapper {
  getUser (user: User) {
    return {
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