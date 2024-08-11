import { TASKS_BLACKLIST_KEYS_FOR_UPDATE } from "../constants/tasks";

export const transformTaskUpdatePayload = (payload: any) => {
    TASKS_BLACKLIST_KEYS_FOR_UPDATE.forEach((key) => delete payload[key]);
  return payload;
};

export default { transformTaskUpdatePayload };