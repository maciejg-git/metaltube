import BEye from "../icons/BEye";
import BHandThumbsUp from "../icons/BHandThumbsUp";
import BPlayFill from "../icons/BPlayFill";
import BPauseFill from "../icons/BPauseFill";
import clsx from "clsx";
import { useState } from "react";
import { channels } from "../config";

const ytimgUrl = "https://i.ytimg.com/vi";

const Playlist = ({ data, playerId, playerState, onImageClick, layout, onSimilarBandsClick }) => {
  const PlaylistItemComponent =
    layout === "normal" ? PlaylistItem : layout === "compact" ? PlaylistItemCompact : PlaylistItem;

  return (
    <div
      className={clsx(
        "flex flex-col divide-y divide-gray-200 dark:divide-neutral-700",
        layout === "normal" && "-mt-2",
      )}
    >
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
            onSimilarBandsClick={onSimilarBandsClick}
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
          <div
            className={clsx(
              "rounded-full bg-black/50",
              layout === "normal" && "p-2",
              layout === "compact" && "p-1",
            )}
          >
            <BPauseFill
              className={clsx(
                "text-gray-100",
                layout === "normal" && "h-16 w-16",
                layout === "compact" && "h-10 w-10",
              )}
            ></BPauseFill>
          </div>
        ) : (
          <div
            className={clsx(
              "rounded-full bg-black/50",
              layout === "normal" && "p-2",
              layout === "compact" && "p-1",
            )}
          >
            <BPlayFill
              className={clsx(
                "text-gray-100",
                layout === "normal" && "h-16 w-16 translate-x-1",
                layout === "compact" && "h-10 w-10 translate-x-0.5",
              )}
            ></BPlayFill>
          </div>
        )}
      </div>
    </div>
  );
};

const PlaylistItem = ({ item, playerId, playerState, onImageClick, onSimilarBandsClick }) => {
  const playingItem = playerId === item.id && playerState === 2;

  return (
    <div className="group flex gap-x-4 py-6">
      <ImageCover
        item={item}
        onImageClick={onImageClick}
        playingItem={playingItem}
        layout="normal"
      />

      <div className="flex flex-1 flex-col">
        <div className="flex flex-1">
          <div className="group flex flex-1 flex-col gap-y-1">
            <div className="flex items-center text-xl font-semibold">
              <a href={`https://www.youtube.com/watch?v=${item.id}`} target="_blank">
                {item.title}
              </a>
            </div>
            <div className="text-lg">{item.displayGenre || item.genre}</div>
            <div className="text-gray-600 dark:text-gray-400">{item.country}</div>
            <div className="text-gray-600 dark:text-gray-400">{item.year}</div>
          </div>
          <div className="flex flex-col items-end gap-y-3 text-sm md:text-base">
            <div className="flex flex-col items-start gap-x-4 md:flex-row">
              <div className="flex items-center gap-x-1">
                <BEye></BEye>
                {item.views}
              </div>
              <div className="flex items-center gap-x-1">
                <BHandThumbsUp></BHandThumbsUp>
                {item.likes}
              </div>
            </div>
            {item.reviews > 0 && (
              <div className="flex gap-x-2">
                <img src="/metal-archives.ico" alt="" />
                {item.rating} ({item.reviews})
              </div>
            )}
          </div>
        </div>
        <div className="flex hidden items-center gap-x-4 group-hover:flex">
          {item.hasSimilarBands && (
            <button
              onClick={() => onSimilarBandsClick(item)}
              className="rounded-full bg-gray-100 px-3 py-2 text-sm font-semibold hover:bg-gray-50 dark:bg-neutral-800 hover:dark:bg-neutral-700"
            >
              Similar bands
            </button>
          )}
          <a
            href={`https://www.metal-archives.com/bands/${item.band}/`}
            className="text-sm font-semibold text-sky-500 underline dark:text-sky-400"
          >
            Metal Archives
          </a>
        </div>
      </div>
    </div>
  );
};

const PlaylistItemCompact = ({
  item,
  playerId,
  playerState,
  onImageClick,
  onSimilarBandsClick,
}) => {
  const playingItem = playerId === item.id && playerState === 2;

  return (
    <div className="group flex gap-x-4 py-2">
      <ImageCover
        item={item}
        onImageClick={onImageClick}
        playingItem={playingItem}
        layout="compact"
      />
      <div className="flex flex-1">
        <div className="flex flex-1 flex-col gap-y-1">
          <div className="flex items-center gap-x-2 font-semibold">
            <a href={`https://www.youtube.com/watch?v=${item.id}`} target="_blank">
              {item.title}
            </a>
            <div className="flex hidden gap-x-2 group-hover:flex">
              <a
                href={`https://www.metal-archives.com/bands/${item.band}/`}
                className="text-sm font-semibold text-sky-500 underline dark:text-sky-400"
                target="_blank"
              >
                Metal Archives
              </a>
              {item.hasSimilarBands && (
                <button
                  onClick={() => onSimilarBandsClick(item)}
                  className="text-sm font-semibold text-sky-500 underline dark:text-sky-400"
                >
                  Similar bands
                </button>
              )}
            </div>
          </div>
          <div className="text-base">{item.displayGenre || item.genre}</div>
          <div className="flex gap-x-2 text-sm">
            <div className="text-gray-600 dark:text-gray-400">{item.country}</div>
            <div className="text-gray-600 dark:text-gray-400">{item.year}</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-y-4">
          <div className="flex flex-col items-start gap-x-4 text-sm md:flex-row">
            <div className="flex items-center gap-x-1">
              <BEye></BEye>
              {item.views}
            </div>
            <div className="flex items-center gap-x-1">
              <BHandThumbsUp></BHandThumbsUp>
              {item.likes}
            </div>
          </div>
          {item.reviews > 0 && (
            <div className="flex gap-x-2 text-sm">
              <img src="/metal-archives.ico" alt="" />
              {item.rating} ({item.reviews})
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Playlist;
