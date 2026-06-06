import BList from "../icons/BList";
import BViewStacked from "../icons/BViewStacked";
import clsx from "clsx";

const LayoutControl = ({ layout, setLayout }) => {
  return (
    <div className="ml-2 flex gap-x-4">
      <button
        onClick={() => setLayout("default")}
        className={clsx(layout !== "default" && "opacity-20 dark:opacity-40")}
      >
        <BViewStacked className="h-6 w-6"></BViewStacked>
      </button>
      <button
        onClick={() => setLayout("compact")}
        className={clsx(layout !== "compact" && "opacity-20 dark:opacity-40")}
      >
        <BList className="h-6 w-6"></BList>
      </button>
    </div>
  );
};

export default LayoutControl;
