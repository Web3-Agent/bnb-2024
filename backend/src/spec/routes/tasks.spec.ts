import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import createServer from "../../utils/server";
import HTTP_RESPONSE_MESSAGES from "../../constants/httpResponseMessages";
import { TASKS_STATUS } from "../../constants/tasks";
export const app = createServer();

describe.only(`Tasks CRUD API unit tests`, () => {
    const wrongTaskId = "wrongTaskId";
    let loggedInUserDetails: {
        token: string;
        user: any;
    };
    const createTaskPayload = {
        title: "My task test",
        description: "I am testing task",
    };
    let newlyCreatedTask: any;
    let newlyUpdatedTask: any;

    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());

        const createUserPayload = {
            email: "dev@outlook.com",
            password: "Dev123.@",
            name: "John Wick",
        };
        const loginCredentials = {
            email: "dev@outlook.com",
            password: "Dev123.@",
        };
        await request(app)
            .post("/api/v1/authentication/register")
            .send(createUserPayload);

        const {
            body: {
                data: { user, token },
            },
        } = await request(app)
            .post("/api/v1/authentication/login")
            .send(loginCredentials);
        loggedInUserDetails = {
            user,
            token,
        };
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    });

    describe(`POST API CALL: WRITE OPERATIONS`, () => {
        it("should return list of tasks of logged in user", async () => {
            const { body, statusCode } = await request(app)
                .post("/api/v1/task")
                .send(createTaskPayload)
                .set("authorization", `Bearer ${loggedInUserDetails.token}`);

            expect(statusCode).toBe(200);
            expect(body).toMatchObject({
                message: HTTP_RESPONSE_MESSAGES.TASK_CREATE_SUCCESS,
                data: {
                    title: 'My task test',
                    description: 'I am testing task',
                    status: 'PENDING',
                    isActive: true,
                }
            });
            expect(body.success).toBeTruthy();
            newlyCreatedTask = body.data;
        });
    });

    describe(`GET API CALL: READ OPERATIONS`, () => {
        it("should return list of tasks of logged in user", async () => {
            const { body, statusCode } = await request(app)
                .get("/api/v1/task")
                .set("authorization", `Bearer ${loggedInUserDetails.token}`);
            expect(statusCode).toBe(200);
            expect(body).toMatchObject({
                message: HTTP_RESPONSE_MESSAGES.TASK_FETCH_SUCCESS,
            });
            expect(body.success).toBeTruthy();
            expect(body.data.length).toBe(1);
        });

        it("should return task of logged in user by taskId", async () => {
            const _id = newlyCreatedTask?._id;
            const { body, statusCode } = await request(app)
                .get(`/api/v1/task/${_id}`)
                .set("authorization", `Bearer ${loggedInUserDetails.token}`);
            expect(statusCode).toBe(200);
            expect(body).toMatchObject({
                message: HTTP_RESPONSE_MESSAGES.TASK_FETCH_SUCCESS,
            });
            expect(body.success).toBeTruthy();
        });

        it("shouldn't return task of logged in user by taskId because wrong taskId", async () => {
            const { body, statusCode } = await request(app)
                .get(`/api/v1/task/${wrongTaskId}`)
                .set("authorization", `Bearer ${loggedInUserDetails.token}`);
            expect(statusCode).toBe(400);
            expect(body).toMatchObject({
                message: 'TaskId length must be at least 24 characters long!',
            });
            expect(body.success).toBeFalsy();
        });

        it("shouldn't return task of logged in user by taskId because taskId not exists in db", async () => {
            const dummyId = new mongoose.Types.ObjectId();
            const { body, statusCode } = await request(app)
                .get(`/api/v1/task/${dummyId}`)
                .set("authorization", `Bearer ${loggedInUserDetails.token}`);

            expect(statusCode).toBe(200);
            expect(body).toMatchObject({
                message: HTTP_RESPONSE_MESSAGES.TASK_FETCH_SUCCESS,
            });
            expect(body.success).toBeTruthy();
            expect(body.data).toBeNull();
        });
    });

    describe(`PUT API CALL: UPDATE OPERATIONS`, () => {
        it("should return updated task of logged in user", async () => {
            const _id = newlyCreatedTask?._id;
            const updateTask = {
                title: "My update task test",
                description: "I am testing task update",
            };

            const {
                body,
                body: { data },
                statusCode,
            } = await request(app)
                .put(`/api/v1/task/${_id}`)
                .send(updateTask)
                .set("authorization", `Bearer ${loggedInUserDetails.token}`);

            expect(statusCode).toBe(200);
            expect(body).toMatchObject({
                message: HTTP_RESPONSE_MESSAGES.TASK_UPDATE_SUCCESS,
            });
            expect(body.success).toBeTruthy();
            expect(data.title).toBe(updateTask.title);
            expect(data.description).toBe(updateTask.description);
        });
    });

    describe(`PATCH API CALL: UPDATE STATUS`, () => {
        it(`should return updated status ${TASKS_STATUS.PENDING} -> ${TASKS_STATUS.COMPLETED} task of logged in user`, async () => {
            const _id = newlyCreatedTask?._id;

            const {
                body,
                body: { data },
                statusCode,
            } = await request(app)
                .patch(`/api/v1/task/${_id}/status/${TASKS_STATUS.COMPLETED}`)
                .set("authorization", `Bearer ${loggedInUserDetails.token}`);

            expect(statusCode).toBe(200);
            expect(body).toMatchObject({
                message: HTTP_RESPONSE_MESSAGES.TASK_UPDATE_SUCCESS,
            });
            expect(body.success).toBeTruthy();
            expect(data.status).toBe(TASKS_STATUS.COMPLETED);
            expect(data._id).toBe(_id);
        });

        it(`should return updated status ${TASKS_STATUS.COMPLETED} -> ${TASKS_STATUS.PENDING} task of logged in user`, async () => {
            const _id = newlyCreatedTask?._id;

            const {
                body,
                body: { data },
                statusCode,
            } = await request(app)
                .patch(`/api/v1/task/${_id}/status/${TASKS_STATUS.PENDING}`)
                .set("authorization", `Bearer ${loggedInUserDetails.token}`);

            expect(statusCode).toBe(200);
            expect(body).toMatchObject({
                message: HTTP_RESPONSE_MESSAGES.TASK_UPDATE_SUCCESS,
            });
            expect(body.success).toBeTruthy();
            expect(data.status).toBe(TASKS_STATUS.PENDING);
            expect(data._id).toBe(_id);
        });
    });

    describe(`DELETE API CALL: SOFT DELETE`, () => {
        it(`should delete task of logged in user`, async () => {
            const _id = newlyCreatedTask?._id;

            const {
                body,
                body: { data },
                statusCode,
            } = await request(app)
                .delete(`/api/v1/task/${_id}`)
                .set("authorization", `Bearer ${loggedInUserDetails.token}`);

            expect(statusCode).toBe(200);
            expect(body).toMatchObject({
                message: HTTP_RESPONSE_MESSAGES.TASK_DELETED_SUCCESS,
            });
            expect(body.success).toBeTruthy();
            expect(data.status).toBe(TASKS_STATUS.PENDING);
            expect(data._id).toBe(_id);
            expect(data.isActive).toBe(false);
        });
    });
});