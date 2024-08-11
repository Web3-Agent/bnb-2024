import UserModel from "../models/user";

export const create = async (object: any = {}) => {
  try {
    const result = await UserModel.create(object);
    return result;
  } catch (error) {
    throw error;
  }
};

export const update = async (query: any = {}, object: any = {}, options = {}) => {
  try {
    const result = await UserModel.findOneAndUpdate(query, object, {
      new: true,
      ...options
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const fetch = async (query: any) => {
  try {
    const result = await UserModel.find(query).lean();
    return result;
  } catch (error) {
    throw error;
  }
};
export const fetchOne = async (query: any) => {
  try {
    const result = await UserModel.findOne(query).lean();
    return result;
  } catch (error) {
    throw error;
  }
};

export const fetchById = async (_id: string, optional: any = {}) => {
  try {
    const query = { _id, ...optional };
    const result = await UserModel.findOne(query).lean();
    return result;
  } catch (error) {
    throw error;
  }
};

export const deleteById = async (_id: string, optional: any = {}) => {
  try {
    const query = { _id, ...optional };
    const result = await UserModel.findOneAndUpdate(
      query,
      {
        isActive: false,
      },
      { new: true }
    ).lean();
    return result;
  } catch (error) {
    throw error;
  }
};

export const countDocuments = async (query: any = {}) => {
  try {
    const result = await UserModel.countDocuments(query).lean();
    return result;
  } catch (error) {
    throw error;
  }
};

export const updateOne = async (query = {}, object = {}, options = {}) => {
  try {
    const result = await UserModel.updateOne(query, object, options);
    return result;
  } catch (error) {
    throw error;
  }
}