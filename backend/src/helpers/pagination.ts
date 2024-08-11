import { PageInfo } from "../types/pageInfo";

export const getPaginationQueryData = (pageInfo: PageInfo) => {
  let currentPage = parseInt(pageInfo?.currentPage) || 0;
  let limit = parseInt(pageInfo?.limit) || 10;
  let skip = currentPage * limit;

  if (pageInfo?.sendAllRecords === "YES") {
    currentPage = 0;
    skip = 0;
    limit = 0;
  }

  return { skip, limit, currentPage };
};

export const getPaginationInfo = (
  total: number,
  limit: number,
  currentPage: number
) => {
  return {
    totalRecords: total,
    currentPage,
    totalPages: limit ? Math.ceil(total / limit) : 0,
    limit,
  };
};

export default {
  getPaginationQueryData,
  getPaginationInfo,
};