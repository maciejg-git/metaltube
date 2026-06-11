import { useState } from "react";
import { Autocomplete } from "@base-ui/react/autocomplete";
import { channels } from "../config";

const BandsAutocomplete = ({ items, onClickItem }) => {
  const [value, setValue] = useState("")

  const { startsWith } = Autocomplete.useFilter()

  return (
    <Autocomplete.Root
      items={items}
      limit={15}
      value={value}
      onValueChange={(i, e) => {
        if (e.reason === "input-change") {
          setValue(e.event.target.value)
        }
        if (e.reason === "item-press") {
          let item = JSON.parse(i)
          setValue(item.name)
          onClickItem(item)
        }
      }}
      filter={startsWith}
    >
      <Autocomplete.InputGroup>
        <Autocomplete.Input
          className="flex min-w-[600px] flex-1 items-center rounded-full bg-gray-100 px-5 py-1 outline-hidden transition-shadow duration-200 focus-within:ring-3 focus-within:ring-violet-200 focus:outline-hidden dark:bg-neutral-700 dark:text-gray-300 dark:focus-within:ring-violet-300"
          placeholder="Find band..."
        />
      </Autocomplete.InputGroup>

        <Autocomplete.Portal>
          <Autocomplete.Positioner sideOffset={5} collisionPadding={5}>
            <Autocomplete.Popup className="w-[var(--anchor-width)] max-w-[var(--available-width)] rounded-lg border border-gray-200 bg-white p-2 dark:border-neutral-700 dark:bg-neutral-800 shadow-lg">
              <Autocomplete.List>
                {(group) => (
                  <Autocomplete.Group key={group.channel} items={group.items}>
                    <Autocomplete.GroupLabel className="my-2 py-2 pl-4 text-sm font-semibold flex gap-x-2 items-center dark:text-white">
                  <img src={channels[group.channel].img} alt="" className="w-5 h-5" />
                      {channels[group.channel].name}
                    </Autocomplete.GroupLabel>
                    <Autocomplete.Collection>
                      {(i) => (
                        <Autocomplete.Item
                          key={i}
                          value={{name: i, channel: group.channel}}
                          className="flex rounded-lg py-2 pr-4 pl-4 hover:bg-gray-50 hover:dark:bg-neutral-700 cursor-default"
                        >
                          {i}
                        </Autocomplete.Item>
                      )}
                    </Autocomplete.Collection>
                  </Autocomplete.Group>
                )}
              </Autocomplete.List>
            </Autocomplete.Popup>
          </Autocomplete.Positioner>
        </Autocomplete.Portal>
    </Autocomplete.Root>
  );
};

export default BandsAutocomplete;
