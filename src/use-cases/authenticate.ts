import { UsersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";
import bcryptjs from "bcryptjs";
import { InvalidCredentialError } from "./errors/invalid-credentials-error";

interface AuthenticateUseCaseRequest {
  email: string;
  password: string;
}

interface AuthenticateUseCaseResponse {
  user: User
}

export class AuthenticateUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({ email, password }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialError();
    }

    const doesPasswordMatch = await bcryptjs.compare(password, user.password_hash);

    if (!doesPasswordMatch) {
      throw new InvalidCredentialError();
    }

    return {
      user,
    };
  }
}