export const removeKeyFromObject = (keys: string[], payload: any) => {
    keys.forEach((key) => delete payload[key]);
    return payload;
  };
  
  export default { removeKeyFromObject };