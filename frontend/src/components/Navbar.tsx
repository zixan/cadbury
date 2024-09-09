import Link from "next/link";
import bowtieImage from "../images/bowtie.png";
import Image from "next/image";
import placeholderAvatar from "../images/124599.jpeg";

export default function Navbar() {
  return (
    <>
      <nav className="bg-white border-b border-gray-400">
        <div className="max-w-screen-2xl flex flex-wrap items-center justify-between mx-auto py-4">
          <a
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <Image
              src={bowtieImage}
              className="h-3 w-auto"
              alt="Flowbite Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap">
              Cadbury
            </span>
          </a>
          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          <div className="hidden w-full md:block md:w-auto" id="navbar-default">
            {/* Add avatar and name here */}
            <div className="flex items-center space-x-4">
              <Image
                src={placeholderAvatar}
                alt="User avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
