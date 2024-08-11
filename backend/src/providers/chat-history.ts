import ChatHistoryModel from "../models/chat-history";

export const create = async (object: any = {}) => {
    try {
        const result = await ChatHistoryModel.create(object);
        return result;
    } catch (error) {
        throw error;
    }
};

export const update = async (query: any = {}, object: any = {}, options = {}) => {
    try {
        const result = await ChatHistoryModel.findOneAndUpdate(query, object, {
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
        const result = await ChatHistoryModel.find(query).lean();
        return result;
    } catch (error) {
        throw error;
    }
};
export const fetchOne = async (query: any) => {
    try {
        const result = await ChatHistoryModel.findOne(query).lean();
        return result;
    } catch (error) {
        throw error;
    }
};

export const fetchById = async (_id: string, optional: any = {}) => {
    try {
        const query = { _id, ...optional };
        const result = await ChatHistoryModel.findOne(query).lean();
        return result;
    } catch (error) {
        throw error;
    }
};

export const deleteById = async (_id: string, optional: any = {}) => {
    try {
        const query = { _id, ...optional };
        const result = await ChatHistoryModel.findOneAndUpdate(
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
        const result = await ChatHistoryModel.countDocuments(query).lean();
        return result;
    } catch (error) {
        throw error;
    }
};

export const updateOne = async (query = {}, object = {}, options = {}) => {
    try {
        const result = await ChatHistoryModel.updateOne(query, object, options);
        return result;
    } catch (error) {
        throw error;
    }
}