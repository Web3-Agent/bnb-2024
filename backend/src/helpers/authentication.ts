import { BLACKLIST_KEYS_FOR_RETURN_USER } from "../constants/authentications";

export const transformUserToReturnToClient = (payload: any) => {
  BLACKLIST_KEYS_FOR_RETURN_USER.forEach((key) => delete payload[key]);
  return payload;
};

export default { transformUserToReturnToClient };