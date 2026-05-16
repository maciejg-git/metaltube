const classes = "rounded-lg bg-gray-50 dark:bg-neutral-800"

const PlaceholderFilters = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <div className={classes + " w-40 h-6"}></div>
      <div className={classes + " w-full h-12"}></div>
      <div className={classes + " w-40 h-6"}></div>
      <div className={classes + " w-full h-12"}></div>
      <div className={classes + " w-40 h-6"}></div>
      <div className={classes + " w-full h-12"}></div>
      <div className={classes + " w-40 h-6"}></div>
      <div className={classes + " w-full h-12"}></div>
    </div>
  )
}

const PlaceholderPlaylist = () => {
  return (
    <div className="flex flex-col gap-y-2 mt-10">
      <div className={classes + " w-50 h-10 ml-auto"}></div>
      <div className={classes + " w-full h-60"}></div>
    </div>
  )
}

export { PlaceholderFilters, PlaceholderPlaylist }
