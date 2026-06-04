import DarkModeButton from "./DarkModeButton.jsx";
import ChannelsDropdown from "./ChannelsDropdown.jsx"

const Navbar = ({ darkMode, onClickDarkMode, setCurrent }) => {
  return (
    <nav className="flex justify-between px-4 py-2 shadow-lg dark:bg-neutral-800 dark:shadow-black/60">
      <div className="flex gap-x-2 items-center">
        <img src="/favicon.png" alt="" className="w-7 h-7" />
        <div className="text-xl font-semibold">Metaltube</div>
      </div>
      <div className="flex gap-x-4">
    {/*<ChannelsDropdown setCurrent={setCurrent}>
          <ChannelButton>
            Black Metal Promotion
          </ChannelButton>
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
      className="rounded-lg border border-gray-300 px-4 text-sm hover:bg-gray-50 dark:border-gray-500 hover:dark:bg-neutral-700"
    >
      {children}
    </button>
  );
};

export default Navbar;
