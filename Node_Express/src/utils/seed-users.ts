import {AppDataSource} from "../data-source.js"
import { User } from "../models/User.js";
import { hashPassword } from "./password.js";

async function seedUsers() {
  const userRepository = AppDataSource.getRepository(User);
  const count = await userRepository.count();
  if (count > 0) return;

  const bookCategory = await userRepository.findOneBy({name: "Books"})
  if (bookCategory) {
    const user: User[] = [
        new User("Duy", "duy@example.com",  await hashPassword("hashed_password_123"), "admin"),
        new User("Koen", "koen@example.com", await hashPassword("hashed_password_456"), "user"),
        new User("Sam", "sam@example.com", await hashPassword("hashed_password_789"), "user"),
    ]

    await userRepository.save(user);
    
  }
}
export {seedUsers}