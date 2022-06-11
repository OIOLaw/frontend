import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { FC } from "react";
import Layout from "../../src/components/Layout";

const UpdatePage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return <Layout>UPDATE TRUST PAGE {id}</Layout>;
};

export default UpdatePage;
