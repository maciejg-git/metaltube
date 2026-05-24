import DarkModeButton from "./DarkModeButton.jsx";

const Navbar = ({ darkMode, onClickDarkMode, setCurrent }) => {
  return (
    <nav className="flex justify-between px-4 py-2 shadow-lg dark:bg-neutral-800 dark:shadow-black/60">
      <div className="text-xl font-semibold">Metaltube</div>
      <div className="flex gap-x-4">
    {/*<ChannelButton setCurrent={setCurrent} channel="bmp">
          Black Metal Promotion
        </ChannelButton>
        <ChannelButton setCurrent={setCurrent} channel="abma">
          Atmospheric Black Metal Albums
        </ChannelButton>*/}
        <DarkModeButton darkMode={darkMode} onClickDarkMode={onClickDarkMode}></DarkModeButton>
      </div>
    </nav>
  );
};

const ChannelButton = ({ children, channel, setCurrent }) => {
  return (
    <button
      onClick={() => setCurrent(channel)}
      className="rounded-lg border border-gray-300 px-4 text-sm hover:bg-gray-50 dark:border-gray-500 hover:dark:bg-neutral-700"
    >
      {children}
    </button>
  );
};

export default Navbar;
