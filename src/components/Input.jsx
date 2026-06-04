export default function Input({ className, ...props }) {
  return (
    <input
      {...props}
      className={
        "flex flex-1 items-center rounded-full bg-gray-100 px-5 py-3 outline-hidden transition-shadow duration-200 focus-within:ring-3 focus-within:ring-violet-200 focus:outline-hidden dark:bg-neutral-700 dark:text-gray-300 dark:focus-within:ring-violet-300 " +
        className
      }
    />
  );
}
