import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

let ChannelsDropdown = ({ children, setCurrent }) => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        sideOffset={5}
        collisionPadding={5}
        className="min-w-40 rounded-lg border border-gray-200 bg-white px-2 py-2 dark:border-neutral-700 dark:bg-neutral-800"
      >
        <DropdownMenu.Item
          className="rounded-lg py-2 pr-6 pl-4 hover:bg-gray-50 hover:dark:bg-neutral-700"
          onSelect={() => setCurrent("bmp")}
        >
          Black Metal Promotion
        </DropdownMenu.Item>
        <DropdownMenu.Item
          className="rounded-lg py-2 pr-6 pl-4 hover:bg-gray-50 hover:dark:bg-neutral-700"
          onSelect={() => setCurrent("tdsa")}
        >
          The Dungeon Synth Archives
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);

export default ChannelsDropdown;
