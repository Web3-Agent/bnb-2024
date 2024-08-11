import { Response } from "express";
import { fetch, fetchOne, create, updateOne, deleteById } from "../providers/contract-templates";

import HTTP_RESPONSE_MESSAGES from "../constants/httpResponseMessages";
import { CustomRequest } from "../types/customRequest";


export const getContractTemplates = async (request: CustomRequest, response: Response) => {
    try {
        const query: any = { isActive: true };
        const { tags, title, description } = request.query;
        if (title) {
            query.title = { '$regex': title, $options: 'i' }
        };
        if (description) {
            query.description = { '$regex': description, $options: 'i' }
        };
        if (tags && tags?.length) {
            query.tags = { '$in': tags, }
        }
        const templates = await fetch(query);
        return response.status(200).json({
            success: true,
            message: HTTP_RESPONSE_MESSAGES.CONTRACT_TEMPLATES_FETCH_SUCCESS,
            data: templates,
        });
    } catch (error) {
        response.status(400).json({ message: HTTP_RESPONSE_MESSAGES.CONTRACT_TEMPLATES_FETCH_FAILED, success: false });
    }
}
export const getContractTemplate = async (request: CustomRequest, response: Response) => {
    try {
        const { id: _id } = request.params;
        const query = { _id, isActive: true };
        const template = await fetchOne(query);
        return response.status(200).json({
            success: true,
            message: HTTP_RESPONSE_MESSAGES.CONTRACT_TEMPLATE_FETCH_SUCCESS,
            data: template,
        });
    } catch (error) {
        response.status(400).json({ message: HTTP_RESPONSE_MESSAGES.BAD_REQUEST, success: false });
    }
}

export const createContractTemplate = async (request: CustomRequest, response: Response) => {
    try {
        const { body } = request;


        const template = await create(body);
        return response.status(200).json({
            success: true,
            message: HTTP_RESPONSE_MESSAGES.CONTRACT_TEMPLATE_CREATE_SUCCESS,
            data: template,
        });
    } catch (error) {
        response.status(400).json({ message: HTTP_RESPONSE_MESSAGES.BAD_REQUEST, success: false });
    }
}
export const updateContractTemplate = async (request: CustomRequest, response: Response) => {
    try {
        const { body } = request;
        const { id: _id } = request.params;
        const template = await updateOne({ _id }, body, { new: true });
        return response.status(200).json({
            success: true,
            message: HTTP_RESPONSE_MESSAGES.CONTRACT_TEMPLATE_UPDATE_SUCCESS,
            data: template,
        });
    } catch (error) {
        response.status(400).json({ message: HTTP_RESPONSE_MESSAGES.BAD_REQUEST, success: false });
    }
}
export const deleteContractTemplate = async (request: CustomRequest, response: Response) => {
    try {
        const { id: _id } = request.params;
        const template = await deleteById(_id);
        return response.status(200).json({
            success: true,
            message: HTTP_RESPONSE_MESSAGES.CONTRACT_TEMPLATE_DELETE_SUCCESS,
            data: template,
        });
    } catch (error) {
        response.status(400).json({ message: HTTP_RESPONSE_MESSAGES.BAD_REQUEST, success: false });
    }
}
export default { getContractTemplates, getContractTemplate, createContractTemplate, updateContractTemplate, deleteContractTemplate }