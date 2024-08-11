import mongoose from "mongoose";
const { Schema, model } = mongoose;

const constructorParametersSchema = new Schema({
    label: {
        type: String,
        trim: true,
    },
    key: {
        type: String,
        trim: true,
    }, dataType: {
        type: String,
        trim: true,
    }
})
const contractTemplatesSchema = new Schema(
    {
        title: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        tags: {
            type: [String],
        },
        code: {
            type: String,
            trim: true,
        },
        constructorParameters: {
            type: [constructorParametersSchema]
        },
        createdBy: {
            type: String,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export default model(`contract-templates`, contractTemplatesSchema, `contract-templates`);