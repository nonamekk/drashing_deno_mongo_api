
// validate input
// is email
// is email unique
// is password correct
// is password strong
// is username unique

import UserModel from "../models/user_model.ts";
import { aes } from "../config.ts";


export default class ValidationService {
    static decodeInput(input: string): string | undefined {
        if ((typeof input) !== "string") {
            return input;
        }
        return decodeURIComponent(input);
    }


    
    static isEmail(email: string): boolean {
        const emailRegex = new RegExp(
          /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
        );
        return emailRegex.test(email);
      }
    

    static async isEmailUnique(email: string): Promise<boolean> {
        const user = await UserModel.getByEmail(email);
        // if user exists return true, if not return false.

        return !user ? true : false;
    }

    static async isUsernameUnique(username: string): Promise<boolean> {
        const user = await UserModel.getByUsername(username);
        // if user exists return true, if not return false.
        return !user ? true : false;
    }

    static async isPasswordCorrect(hashedPassword: string, rawPassword: string): Promise<boolean> {
        const rawPasswordHashed = await aes.encrypt(rawPassword)
        if (rawPasswordHashed.hex() == hashedPassword) {
            return true;
        }
        return false;
    }

    static isPasswordStrong(password: string): boolean {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(password);
    }
}