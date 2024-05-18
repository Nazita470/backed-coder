import UserManager from "../dao/services/userManager.js";
import UserRepositories from "./user.repositories.js";

export const userRepositories = new UserRepositories(new UserManager())