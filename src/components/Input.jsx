export default function Input({ className, ...props }) {
  return (
    <input
      {...props}
      className={
        "outline-hidden focus-within:ring-3 focus:outline-hidden flex flex-1 items-center rounded-sm border border-gray-300 bg-white px-3 py-2 transition-shadow duration-200 focus-within:border-gray-400 focus-within:ring-violet-200 dark:border-neutral-500 dark:bg-neutral-700 dark:text-gray-300 dark:focus-within:ring-violet-300 " +
        className
      }
    />
  );
}
