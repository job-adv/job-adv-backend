
import { UUID } from "crypto";
import { v4 as uuidv4 } from "uuid"
import * as crypto from 'crypto';

type UserType= {
  user_id: string,
  role: string
  username: string,
  firstname: string,
  lastname: string,
  email: string,
  password: string,
  adress: string
}

export default UserType;