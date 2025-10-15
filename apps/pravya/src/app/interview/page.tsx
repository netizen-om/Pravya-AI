import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <>
      <div className="min-h-screen w-full bg-zinc-950 flex items-center p-4">
        <div className="bg-zinc-900 w-full">
          <h2 className="text-2xl px-4 py-2 pt-4">
            Senior IT Engineer - Live Interview
          </h2>
          <p className="text-l px-4 py-2">Al Interview session for Fun Ltd</p>

          <div className="grid grid-cols-3 gap-3 w-full py-2">
            <div className="w-auto h-[450] bg-zinc-800 rounded-lg">
                <div className="flex justify-center items-center h-full w-full">
                    <div className="w-[110] h-[110] rounded-full bg-white"></div>
                </div>
            </div>
            <div className="w-auto h-[450] bg-zinc-800 rounded-lg">
                <div className="flex justify-center items-center h-full w-full">
                    <Image 
                    src="/user-avatar.png" 
                    width={110} 
                    height={110} 
                    alt="placerholder"
                    className=" rounded-full object-cover"
                    />
                </div>
            </div>
            <div className="w-auto h-[450] bg-zinc-800 rounded-lg"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
