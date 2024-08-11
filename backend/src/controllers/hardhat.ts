import { Response } from "express";
import path from 'path';
import AdmZip from 'adm-zip';
import { CustomRequest } from "../types/customRequest";

export const downloadHardhatProject = (request: CustomRequest, response: Response) => {
    try {
        const { body: { sourceCode } }: any = request;
        console.log({ sourceCode });

        if (!sourceCode) {
            return response.status(400).json({ message: 'SOURCE_CODE_IS_MISSING', data: sourceCode });
        }

        const zip = new AdmZip();
        zip.addFile('contracts/MyContract.sol', Buffer.from(sourceCode, 'utf8'));
        zip.addLocalFolder(path.join(process.cwd(), 'hardhat-sample-app'));

        const zipBuffer = zip.toBuffer();

        response.setHeader('Content-Disposition', 'attachment; filename=hardhat-sample-app.zip');
        response.setHeader('Content-Type', 'application/zip');
        response.setHeader('Content-Length', zipBuffer.length);

        return response.send(zipBuffer);
    } catch (error: any) {
        return response.status(500).json({ message: 'SOMETHING_WENT_WRONG', error: error?.message });
    }
};

export default { downloadHardhatProject };
