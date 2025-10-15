import React from "react";

const page = () => {
  return (
    <>
      <div className="min-h-screen w-full bg-zinc-950 flex items-center p-4">
        <div className="bg-zinc-900 w-full">
          <h2 className="text-2xl px-4 py-2">
            Senior IT Engineer - Live Interview
          </h2>
          <p className="text-l px-4 py-2">Al Interview session for Fun Ltd</p>

          <div className="grid grid-cols-3 gap-3 w-full py-2">
            <div className="w-auto h-[450] bg-blue-500 rounded-lg"></div>
            <div className="w-auto h-[450] bg-green-500 rounded-lg"></div>
            <div className="w-auto h-[450] bg-red-500 rounded-lg"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
