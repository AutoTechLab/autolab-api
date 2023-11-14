export class UserMapper {
  getUser (user) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      firstname: user.firstname,
      lastname: user.lastname,
      middlename: user.middlename,
      birthDate: user.birthDate,
      avatar: user.avatar,
    };
  }
}