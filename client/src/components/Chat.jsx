import { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import Logo from "./Logo";
import Contact from "./Contact";

const Chat = () => {
  return (
    <div className="flex h-screen">
      <div className="bg-gray-200 w-1/3 flex flex-col">
        <div className="flex-grow">
          <Logo />
          <Contact
            username={"text"}
            id={"65a78b71792ec13b0f439a42"}
            online={true}
            selected={true}
          />
          <Contact
            username={"guy"}
            id={"65a89fd992235af776fce553"}
            online={false}
            selected={false}
          />
          <Contact
            username={"ssss"}
            id={"65a78b71792ec13b4111111"}
            online={false}
            selected={false}
          />
        </div>
        <div className="p-2 text-center flex items-center justify-center">
          <span className="mr-2 text-sm text-gary-600 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-3 h-3"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z"
                clipRule="evenodd"
              />
            </svg>
            Username
          </span>
          <button className="text-sm bg-blue-200 py-1 px-2 text-gray-500 border rounded-xl">
            Logout
          </button>
        </div>
      </div>
      <div className="flex flex-col bg-blue-50 w-2/3 p-2">
        <div className="flex-grow">
          <div className="flex h-full flex-grow items-center justify-center">
            <div className="text-gray-300">
              &larr; Select a person from sidebar "_"
            </div>
          </div>
        </div>
        <form className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message"
            className="bg-white flex-grow border rounded-lg p-2"
          />
          <label className="bg-blue-200 p-2 text-gray-600 cursor-pointer rounded-xl border-blue-200">
            <input type="file" className="hidden" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M15.621 4.379a3 3 0 0 0-4.242 0l-7 7a3 3 0 0 0 4.241 4.243h.001l.497-.5a.75.75 0 0 1 1.064 1.057l-.498.501-.002.002a4.5 4.5 0 0 1-6.364-6.364l7-7a4.5 4.5 0 0 1 6.368 6.36l-3.455 3.553A2.625 2.625 0 1 1 9.52 9.52l3.45-3.451a.75.75 0 1 1 1.061 1.06l-3.45 3.451a1.125 1.125 0 0 0 1.587 1.595l3.454-3.553a3 3 0 0 0 0-4.242Z"
                clipRule="evenodd"
              />
            </svg>
          </label>
          <button
            type="submit"
            className="bg-blue-500 p2 text-white rounded-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
