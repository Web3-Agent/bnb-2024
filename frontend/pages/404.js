import React, { useEffect } from "react";
import { useRouter } from "next/router";

const ErrorPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/");
  }, [router]);
};

export default ErrorPage;
