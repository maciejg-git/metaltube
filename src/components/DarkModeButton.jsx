import BMoon from "../icons/BMoon";
import BSun from "../icons/BSun";
import { useAnimate } from "motion/react-mini";
import { useEffect } from "react";

export default function DarkModeButton({darkMode, onClickDarkMode}) {
  let [scope, animate] = useAnimate();
  useEffect(() => {
    animate(
      "svg",
      { opacity: [0, 1], transform: ["translateX(20px)", "translateX(0)"] },
      { duration: 0.5 }
    );
  }, [darkMode]);

  return (
    <button ref={scope} onClick={onClickDarkMode} className="ml-4">
      {!darkMode ? (
        <BSun className="h-5 w-5"></BSun>
      ) : (
        <BMoon className="h-5 w-5"></BMoon>
      )}
    </button>
  )
}
