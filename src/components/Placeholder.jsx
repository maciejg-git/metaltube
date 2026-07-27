const classes = "rounded-lg bg-gray-50 dark:bg-neutral-800";

const PlaceholderFilters = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className={classes + " h-6 w-40"}></div>
      <div className={classes + " h-12 w-full"}></div>
      <div className={classes + " h-6 w-40"}></div>
      <div className={classes + " h-12 w-full"}></div>
      <div className={classes + " h-6 w-40"}></div>
      <div className={classes + " h-12 w-full"}></div>
      <div className={classes + " h-6 w-40"}></div>
      <div className={classes + " h-12 w-full"}></div>
    </div>
  );
};

const PlaceholderSimilarBandsFilter = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className={classes + " h-10 w-40"}></div>
      <div className={classes + " h-6 w-60"}></div>
      <div className={classes + " h-30 w-full"}></div>
    </div>
  );
};

const PlaceholderPlaylist = () => {
  return (
    <div className="mt-10 flex flex-col gap-y-4">
      <div className="flex justify-between">
        <div className={classes + " h-10 w-30"}></div>
        <div className={classes + " h-10 w-70"}></div>
      </div>
      <div className={classes + " h-60 w-full"}></div>
    </div>
  );
};

export { PlaceholderFilters, PlaceholderSimilarBandsFilter, PlaceholderPlaylist };
