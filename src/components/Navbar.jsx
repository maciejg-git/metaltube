import DarkModeButton from "./DarkModeButton.jsx";
import ChannelsDropdown from "./ChannelsDropdown.jsx";
import FaChevronDownSolid from "../icons/FaChevronDownSolid.jsx";
import { channels } from "../config.js";
import BandsAutocomplete from "./BandsAutocomplete.jsx";

const Navbar = ({ darkMode, onClickDarkMode, current, onChannelClick, bands, onClickItem }) => {
  return (
    <nav className="flex items-center justify-between px-4 py-2 shadow-lg dark:bg-neutral-800 dark:shadow-black/60">
      <div className="flex items-center gap-x-2">
        <img src="/favicon.png" alt="" className="h-7 w-7" />
        <div className="text-xl font-semibold dark:text-white">
          <a href="https://mtl-tube.netlify.app">Metaltube</a>
        </div>
      </div>
      <BandsAutocomplete
        items={bands}
        onClickItem={onClickItem}
        className="mx-10 hidden flex-1 md:block lg:max-w-[600px]"
      ></BandsAutocomplete>
      <div className="flex gap-x-4">
        <ChannelsDropdown
          trigger={<ChannelButton>{channels[current].name}</ChannelButton>}
          onChannelClick={onChannelClick}
        ></ChannelsDropdown>
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
      className="group flex items-center gap-x-2 truncate rounded-full border border-gray-300 px-4 py-1 text-sm font-semibold whitespace-nowrap hover:bg-gray-50 dark:border-gray-500 hover:dark:bg-neutral-700"
    >
      {children}
      <FaChevronDownSolid
        className={"h-4 w-4 transition duration-200 group-data-popup-open:rotate-180"}
      ></FaChevronDownSolid>
    </button>
  );
};

export default Navbar;
