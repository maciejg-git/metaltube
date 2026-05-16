import BEye from "../icons/BEye"
import BChatLeft from "../icons/BChatLeft"
import BHandThumbsUp from "../icons/BHandThumbsUp"

const Playlist = ({data}) => {
  return (
    <div className="flex flex-col divide-y divide-gray-200 dark:divide-neutral-700">
      {data.map((item) => {
        return <PlaylistItem key={item.videoId} item={item}></PlaylistItem>
      })}
    </div>
  )
}

const PlaylistItem = ({item}) => {
  return (
    <div className="flex gap-x-4 py-4">
      <img src={item.thumbnailUrl} alt="" />
      <div className="flex flex-1 flex-col gap-y-1">
        <div className="text-xl font-semibold">
          <a href={`https://www.youtube.com/watch?v=${item.videoId}`}>
            {item.title}
          </a>
        </div>
        <div className="text-lg">
          {item.genre}
        </div>
        <div className="text-gray-600 dark:text-gray-400">
          {item.country}
        </div>
        <div className="text-gray-600 dark:text-gray-400">
          {item.year}
        </div>
      </div>
      <div className="flex gap-x-4 items-start">
        <div className="flex items-center gap-x-1">
          <BEye></BEye>
          {item.views}
        </div>
        <div className="flex items-center gap-x-1">
           <BHandThumbsUp></BHandThumbsUp>
          {item.likes}
        </div>
        <div className="flex items-center gap-x-1">
          <BChatLeft></BChatLeft>
          {item.comments}
        </div>
      </div>
    </div>
  )
}

export default Playlist
