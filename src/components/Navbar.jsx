import DarkModeButton from "./DarkModeButton.jsx";

const Navbar = ({ darkMode, onClickDarkMode }) => {
  return (
    <nav className="flex justify-between px-4 py-2 shadow-lg dark:bg-neutral-800 dark:shadow-black/60">
      <div className="text-xl font-semibold">Metaltube</div>
      <DarkModeButton darkMode={darkMode} onClickDarkMode={onClickDarkMode}></DarkModeButton>
    </nav>
  );
};

export default Navbar;
