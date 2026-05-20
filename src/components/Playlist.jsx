import BEye from "../icons/BEye";
import BHandThumbsUp from "../icons/BHandThumbsUp";

const Playlist = ({ data }) => {
  return (
    <div className="flex flex-col divide-y divide-gray-200 dark:divide-neutral-700">
      {data.length === 0 && (
        <div className="mx-auto mt-20">
          No tracks match. Clearly, this combination doesn't exist yet. Try adjusting your filters.
        </div>
      )}
      {data.map((item) => {
        return <PlaylistItem key={item.id} item={item}></PlaylistItem>;
      })}
    </div>
  );
};

const PlaylistItem = ({ item }) => {
  return (
    <div className="group flex gap-x-4 py-4">
      <a href={`https://www.youtube.com/watch?v=${item.id}`} className="flex">
        <img src={item.img} alt="" />
      </a>
      <div className="flex flex-1 flex-col gap-y-1">
        <div className="flex items-center text-xl font-semibold">
          <a href={`https://www.youtube.com/watch?v=${item.id}`}>{item.title}</a>
          <a
            href={`https://www.metal-archives.com/bands/${item.artist}/`}
            className="ml-4 hidden text-sm text-sky-500 underline group-hover:block dark:text-sky-400"
          >
            metal-archives
          </a>
        </div>
        <div className="text-lg">{item.genre}</div>
        <div className="text-gray-600 dark:text-gray-400">{item.country}</div>
        <div className="text-gray-600 dark:text-gray-400">{item.year}</div>
      </div>
      <div className="flex items-start gap-x-4">
        <div className="flex items-center gap-x-1">
          <BEye></BEye>
          {item.views}
        </div>
        <div className="flex items-center gap-x-1">
          <BHandThumbsUp></BHandThumbsUp>
          {item.likes}
        </div>
      </div>
    </div>
  );
};

export default Playlist;
