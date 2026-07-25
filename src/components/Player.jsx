import { useState, useRef } from "react";
import { clsx } from "clsx";
import BXLg from "../icons/BXLg.jsx";
import BFullscreen from "../icons/BFullscreen.jsx";
import { defaultPlayerOptions, PLAYER } from "../config.js";
import YouTube from "react-youtube";

const Player = ({ playerId, playerState, player, setPlayer, setPlayerState }) => {
  const [playerPosition, setPlayerPosition] = useState(defaultPlayerOptions.position);

  const opts = {
    playerVars: {
      autoplay: 1,
    },
  };

  function handlePositionButtonClick() {
    setPlayerPosition((prev) => (prev === "bottom" ? "center" : "bottom"));
  }

  function handleCloseButtonClick() {
    setPlayerState(0)
    player.stopVideo()
  }

  return (
    <div
      className={clsx(
        "fixed block",
        playerState === PLAYER.STOP && "!hidden",
        playerPosition === "bottom"
          ? "right-4 bottom-4"
          : "right-1/2 bottom-1/2 translate-x-1/2 translate-y-1/2",
      )}
    >
      <div className="mx-1 flex justify-end gap-x-1 py-1">
        <PlayerTopbarButton
          icon={BFullscreen}
          onClick={handlePositionButtonClick}
        ></PlayerTopbarButton>
        <PlayerTopbarButton icon={BXLg} onClick={handleCloseButtonClick}></PlayerTopbarButton>
      </div>

      <div
        className={clsx(
          "transition-shadow",
          { "aspect-video w-[480px] lg:w-[640px]": playerPosition === "bottom" },
          { "aspect-video w-[960px] shadow-3xl shadow-black/80": playerPosition === "center" },
        )}
      >
        <YouTube
          videoId={playerId ?? ""}
          opts={opts}
          className="h-full w-full"
          iframeClassName="w-full h-full"
          onPlay={() => setPlayerState(PLAYER.PLAY)}
          onPause={() => setPlayerState(PLAYER.PAUSE)}
          onReady={(event) => setPlayer(event.target)}
        />
      </div>
    </div>
  );
};

const PlayerTopbarButton = ({ onClick, icon: Icon }) => {
  return (
    <button
      onClick={onClick}
      className="rounded-md bg-gray-500 p-1.5 text-white hover:bg-gray-400 dark:bg-gray-600 hover:dark:bg-gray-500"
    >
      <Icon className="h-4 w-4"></Icon>
    </button>
  );
};

export default Player;
