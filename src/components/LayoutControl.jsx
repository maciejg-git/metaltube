import BList from "../icons/BList";
import BViewStacked from "../icons/BViewStacked";
import clsx from "clsx";
import BGrid from "../icons/BGrid";

const LayoutControl = ({ layout, onLayoutButtonClick }) => {
  return (
    <div className="ml-2 flex gap-x-4">
      <button
        onClick={() => onLayoutButtonClick("normal")}
        className={clsx("text-black dark:text-gray-200", layout !== "normal" && "text-black/20 dark:text-gray-200/40")}
      >
        <BViewStacked className="h-6 w-6"></BViewStacked>
      </button>
      <button
        onClick={() => onLayoutButtonClick("compact")}
        className={clsx("text-black dark:text-gray-200", layout !== "compact" && "text-black/20 dark:text-gray-200/40")}
      >
        <BList className="h-6 w-6"></BList>
      </button>
      <button
        onClick={() => onLayoutButtonClick("cover")}
        className={clsx("text-black dark:text-gray-200", layout !== "grid" && "text-black/20 dark:text-gray-200/40")}
      >
        <BGrid className="h-6 w-6"></BGrid>
      </button>
    </div>
  );
};

export default LayoutControl;
