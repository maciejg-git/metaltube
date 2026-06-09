import BEye from "../icons/BEye";
import BHandThumbsUp from "../icons/BHandThumbsUp";
import BPlayFill from "../icons/BPlayFill";
import BPauseFill from "../icons/BPauseFill";
import clsx from "clsx";

const ytimgUrl = "https://i.ytimg.com/vi"

const Playlist = ({ data, playerId, playerState, onImageClick, layout }) => {
  const PlaylistItemComponent = layout === "normal" ? PlaylistItem : layout === "compact" ? PlaylistItemCompact : PlaylistItem

  return (
    <div className="flex flex-col divide-y divide-gray-200 dark:divide-neutral-700">
      {data.length === 0 && (
        <div className="mx-auto mt-20">
          No tracks match. Clearly, this combination doesn't exist yet. Try adjusting your filters.
        </div>
      )}
      {data.map((item) => {
        return (
          <PlaylistItemComponent
            key={item.id}
            item={item}
            playerId={playerId}
            playerState={playerState}
            onImageClick={onImageClick}
          ></PlaylistItemComponent>
        );
      })}
    </div>
  );
};

const ImageCover = ({ item, onImageClick, playingItem, layout }) => {
  return (
    <div onClick={() => onImageClick(item)} className="relative flex">
      <picture>
        <source
          media="(min-width: 768px)"
          srcSet={`${ytimgUrl}/${item.id}/${layout === "normal" ? "mqdefault.jpg" : "default.jpg"}`}
        />
        <img src={`${ytimgUrl}/${item.id}/default.jpg`} />
      </picture>
      <div
        className={clsx(
          "absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-80",
          { "!opacity-80": playingItem },
        )}
      >
        {playingItem ? (
          <BPauseFill className="h-16 w-16 text-gray-100"></BPauseFill>
        ) : (
          <BPlayFill className="h-16 w-16 text-gray-100"></BPlayFill>
        )}
      </div>
    </div>
  );
};

const PlaylistItem = ({ item, playerId, playerState, onImageClick }) => {
  const playingItem = playerId === item.id && playerState === 2;

  return (
    <div className="flex gap-x-4 py-4">
      <ImageCover item={item} onImageClick={onImageClick} playingItem={playingItem} layout="normal" />
      <div className="group flex flex-1 flex-col gap-y-1">
        <div className="flex items-center text-xl font-semibold">
          <a href={`https://www.youtube.com/watch?v=${item.id}`} target="_blank">
            {item.title}
          </a>
          <a
            href={`https://www.metal-archives.com/bands/${item.band}/`}
            className="ml-4 hidden text-sm text-sky-500 underline group-hover:block dark:text-sky-400"
          >
            metal-archives
          </a>
        </div>
        <div className="text-lg">{item.displayGenre || item.genre}</div>
        <div className="text-gray-600 dark:text-gray-400">{item.country}</div>
        <div className="text-gray-600 dark:text-gray-400">{item.year}</div>
      </div>
      <div className="flex flex-col md:flex-row items-start gap-x-4">
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

const PlaylistItemCompact = ({ item, playerId, playerState, onImageClick }) => {
  const playingItem = playerId === item.id && playerState === 2;

  return (
    <div className="flex gap-x-4 py-2">
      <ImageCover item={item} onImageClick={onImageClick} playingItem={playingItem} layout="compact" />
      <div className="group flex flex-1 flex-col gap-y-1">
        <div className="flex items-center font-semibold">
          <a href={`https://www.youtube.com/watch?v=${item.id}`} target="_blank">
            {item.title}
          </a>
          <a
            href={`https://www.metal-archives.com/bands/${item.band}/`}
            className="ml-4 hidden text-sm text-sky-500 underline group-hover:block dark:text-sky-400"
          >
            metal-archives
          </a>
        </div>
        <div className="text-base">{item.displayGenre || item.genre}</div>
        <div className="flex gap-x-2 text-sm">
          <div className="text-gray-600 dark:text-gray-400">{item.country}</div>
          <div className="text-gray-600 dark:text-gray-400">{item.year}</div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-start gap-x-4 text-sm">
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
