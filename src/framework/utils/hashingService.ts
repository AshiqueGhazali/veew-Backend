import IhasingService from "../../interface/utils/IHashingService";
import bcrypt from "bcrypt";

export default class HashingService implements IhasingService {
  async hashing(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    try {
      let match = await bcrypt.compare(password, hashedPassword);
      return match;
    } catch (error) {
      throw error;
    }
  }
}
