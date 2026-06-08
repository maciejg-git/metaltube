import { Menu } from "@base-ui/react/menu";
import { channels } from "../config.js";

let ChannelsDropdown = ({ children, trigger, onChannelClick }) => (
  <Menu.Root>
    <Menu.Trigger render={trigger} />
    <Menu.Portal>
      <Menu.Positioner sideOffset={5} collisionPadding={5}>
        <Menu.Popup className="min-w-40 rounded-lg border border-gray-200 bg-white px-2 py-2 shadow-md dark:border-neutral-700 dark:bg-neutral-800">
          <Menu.Item
            onClick={() => onChannelClick("bmp")}
            className="flex items-center gap-x-2 rounded-lg py-2 pr-10 pl-2 hover:bg-gray-50 hover:dark:bg-neutral-700"
          >
            <img src={channels.bmp.img} alt="" className="h-5 w-5" />
            {channels.bmp.name}
          </Menu.Item>
          <Menu.Item
            onClick={() => onChannelClick("tdsa")}
            className="flex items-center gap-x-2 rounded-lg py-2 pr-10 pl-2 hover:bg-gray-50 hover:dark:bg-neutral-700"
          >
            <img src={channels.tdsa.img} alt="" className="h-5 w-5" />
            {channels.tdsa.name}
          </Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
);

export default ChannelsDropdown;
