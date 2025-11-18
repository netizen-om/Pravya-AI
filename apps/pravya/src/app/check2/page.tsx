"use client";
import { check2 } from "@/actions/interview-action";
import { interviewAnalyseQueue } from "@/lib/queues";
import React, { useEffect } from "react";

const page = () => {
  useEffect(() => {
    let theGot = async () => {
      
      console.log("Done");
    };
    theGot();
  });
  return <div>page</div>;
};

export default page;
