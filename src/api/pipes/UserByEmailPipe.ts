import { Injectable, NotFoundException, PipeTransform } from "@nestjs/common";
import { UserRepository } from "../repositories/UserRepository";

@Injectable()
export class UserByEmailPipe implements PipeTransform {
  constructor (
    private readonly userRepository: UserRepository,
  ) {}

  async transform(email: string): Promise<string> {
    const user = await this.userRepository.find({
      email,
    });

    if (!user) throw new NotFoundException('User with such email is not found');
    return email;
  }
}