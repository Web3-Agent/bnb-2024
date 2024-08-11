import { Router, Response } from "express";
import { CustomRequest } from "../types/customRequest";
import { getUsersByUsername } from "../controllers/warpcast/usernames";
import { getUsersByFID } from "../controllers/warpcast/usersByFID";
import { getFollowersByFID } from "../controllers/warpcast/followersByFID";
import { createPost } from "../controllers/warpcast/createPost";
import { getUserStorageAllocation } from "../controllers/warpcast/userStorageAllocation";
import { getUserStorageUsage } from "../controllers/warpcast/userStorageUsage";

const WarpcastRouter: Router = Router();

const ACTIONS = {
    SEARCH_FOR_USERNAMES: 'SEARCH_FOR_USERNAMES',
    FETCH_USER_DETAILS_BY_GIVEN_FID: 'FETCH_USER_DETAILS_BY_GIVEN_FID',
    FOLLOWERS_BY_FID: 'FOLLOWERS_BY_FID',
    CREATE_POST: 'CREATE_POST',
    FETCH_USER_STORAGE_ALLOCATION_BY_GIVEN_USERNAME: 'FETCH_USER_STORAGE_ALLOCATION_BY_GIVEN_USERNAME',
    FETCH_USER_STORAGE_USAGE_BY_GIVEN_USERNAME: 'FETCH_USER_STORAGE_USAGE_BY_GIVEN_USERNAME',
}

const navigateController = (request: CustomRequest, response: Response) => {
    try {
        const { body } = request;
        const { action } = body;
        switch (action) {
            case ACTIONS.SEARCH_FOR_USERNAMES:
                return getUsersByUsername(request, response);
            case ACTIONS.FETCH_USER_DETAILS_BY_GIVEN_FID:
                return getUsersByFID(request, response);
            case ACTIONS.FOLLOWERS_BY_FID:
                return getFollowersByFID(request, response);
            case ACTIONS.CREATE_POST:
                return createPost(request, response);
            case ACTIONS.FETCH_USER_STORAGE_ALLOCATION_BY_GIVEN_USERNAME:
                return getUserStorageAllocation(request, response);
            case ACTIONS.FETCH_USER_STORAGE_USAGE_BY_GIVEN_USERNAME:
                return getUserStorageUsage(request, response);
            default:
                return response.status(400).json({
                    success: false,
                    message: 'UNKNOWN_REQUEST'
                })
        }
    } catch (error) {
        return response.status(400).json({
            success: false,
            message: 'UNABLE_TO_PROCESS_REQUEST'
        })
    }
}

WarpcastRouter.post(
    "/",
    navigateController
);


export default WarpcastRouter;