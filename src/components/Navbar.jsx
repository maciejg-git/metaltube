import DarkModeButton from "./DarkModeButton.jsx";
import ChannelsDropdown from "./ChannelsDropdown.jsx";
import FaChevronDownSolid from "../icons/FaChevronDownSolid.jsx";

const Navbar = ({ darkMode, onClickDarkMode, setCurrent }) => {
  return (
    <nav className="flex justify-between px-4 py-2 shadow-lg dark:bg-neutral-800 dark:shadow-black/60">
      <div className="flex items-center gap-x-2">
        <img src="/favicon.png" alt="" className="h-7 w-7" />
        <div className="text-xl font-semibold dark:text-white">
          <a href="https://mtl-tube.netlify.app">Metaltube</a>
        </div>
      </div>
      <div className="flex gap-x-4">
    {/*<ChannelsDropdown setCurrent={setCurrent}>
          <ChannelButton>Black Metal Promotion</ChannelButton>
        </ChannelsDropdown>*/}
        <DarkModeButton darkMode={darkMode} onClickDarkMode={onClickDarkMode}></DarkModeButton>
      </div>
    </nav>
  );
};

const ChannelButton = ({ children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      {...props}
      className="group flex items-center gap-x-2 rounded-full border border-gray-300 px-4 text-sm font-semibold hover:bg-gray-50 dark:border-gray-500 hover:dark:bg-neutral-700"
    >
      {children}
      <FaChevronDownSolid
        className={"h-4 w-4 transition duration-200 group-data-[state=open]:rotate-180"}
      ></FaChevronDownSolid>
    </button>
  );
};

export default Navbar;
