export default function Button({ children, className, onClick }) {
  return (
    <button
      onClick={onClick}
      className={
        "flex items-center justify-center gap-x-2 rounded-lg px-10 py-3 font-semibold dark:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-neutral-700 hover:dark:bg-neutral-600 " +
        className
      }
    >
      {children}
    </button>
  );
}
