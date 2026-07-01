import { useEffect, useRef } from "react";
import BPlayFill from "../icons/BPlayFill";
import BPauseFill from "../icons/BPauseFill";
import clsx from "clsx";
import BXLg from "../icons/BXLg";
import Button from "./Button";

const ytimgUrl = "https://i.ytimg.com/vi";

const CoverLayout = ({ data, playerId, playerState, onImageClick, onCloseButtonClick, onLoadMoreClick, displayPageButton }) => {
  const container = useRef(null)

  useEffect(() => {
    document.body.classList.add("overflow-y-hidden");
    if (container.current) {
      container.current.focus()
    }
    return () => {
      document.body.classList.remove("overflow-y-hidden");
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black scheme-dark animate-fade-in">
      <CoverLayoutCloseButton onClick={onCloseButtonClick} className="absolute top-10 right-10"></CoverLayoutCloseButton>
      <div ref={container} className="overflow-y-auto h-full outline-hidden">
        <div className="mx-auto mt-14 mb-10 grid w-max grid-cols-1 gap-x-4 sm:grid-cols-2 md:grid-cols-3">
          {data.map((item) => (
            <CoverLayoutItem
              key={item.id}
              item={item}
              playerId={playerId}
              playerState={playerState}
              onImageClick={onImageClick}
            ></CoverLayoutItem>
          ))}
        </div>
        <div className="flex justify-center gap-x-4 mb-10">
          {displayPageButton && (
            <Button onClick={onLoadMoreClick} className="!rounded-full">Load more (50)</Button>
          )}
        </div>
      </div>
    </div>
  );
};

const CoverLayoutItem = ({ item, playerId, playerState, onImageClick }) => {
  const playingItem = playerId === item.id && playerState === 2;

  return (
    <div onClick={() => onImageClick(item)} className="relative flex group overflow-hidden">
      <picture>
        <source media="(min-width: 768px)" srcSet={`${ytimgUrl}/${item.id}/hqdefault.jpg`} />
        <img src={`${ytimgUrl}/${item.id}/default.jpg`} className="group-hover:scale-115 transition-transform duration-300 -my-6"/>
      </picture>
      <div className="absolute inset-0 flex flex-col items-start hidden group-hover:flex ml-2 mt-2">
        <div className="font-semibold text-sm bg-black text-gray-200 rounded-lg px-4 py-2">
          {item.title}
        </div>
      </div>
      <div
        className={clsx(
          "absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-80",
          { "!opacity-80": playingItem },
        )}
      >
        {playingItem ? (
          <div className="bg-black/50 p-2 rounded-full">
            <BPauseFill className="h-16 w-16 text-gray-100"></BPauseFill>
          </div>
        ) : (
          <div className="bg-black/50 p-2 rounded-full">
            <BPlayFill className="h-16 w-16 text-gray-100 translate-x-1"></BPlayFill>
          </div>
        )}
      </div>
    </div>
  );
};

const CoverLayoutCloseButton = ({className, ...props}) => {
  return (
    <button className={"hover:text-white text-gray-300 " + className} {...props}>
      <BXLg className="h-7 w-7"></BXLg>
    </button>
  )
}

export default CoverLayout;
