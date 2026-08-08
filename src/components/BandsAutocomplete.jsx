import { useState } from "react";
import { Autocomplete } from "@base-ui/react/autocomplete";
import { channels } from "../config";

const BandsAutocomplete = ({ items, onClickItem, className }) => {
  const [value, setValue] = useState("");

  const { startsWith } = Autocomplete.useFilter();

  return (
    <div className={className}>
      <Autocomplete.Root
        items={items}
        limit={15}
        value={value}
        onValueChange={(i, e) => {
          if (e.reason === "input-change") {
            setValue(e.event.target.value);
          }
          if (e.reason === "item-press") {
            setValue("");
            onClickItem(i);
          }
        }}
        filter={startsWith}
      >
        <Autocomplete.InputGroup>
          <Autocomplete.Input
            className="flex w-full flex-1 items-center rounded-full bg-gray-100 px-5 py-2 outline-hidden transition-shadow duration-200 focus-within:ring-3 focus-within:ring-violet-200 focus:outline-hidden dark:bg-neutral-700 dark:text-gray-300 dark:focus-within:ring-violet-300"
            placeholder="Find band..."
          />
        </Autocomplete.InputGroup>

        <Autocomplete.Portal>
          <Autocomplete.Positioner sideOffset={5} collisionPadding={5}>
            <Autocomplete.Popup className="fade w-[var(--anchor-width)] max-w-[var(--available-width)] rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
              <Autocomplete.Empty>
                <div className="px-4 py-2">No bands found</div>
              </Autocomplete.Empty>
              <Autocomplete.List>
                <Autocomplete.Collection>
                  {(i) => (
                    <Autocomplete.Item
                      key={i}
                      value={i}
                      className="flex cursor-default rounded-lg py-2 pr-4 pl-4 hover:bg-gray-50 hover:dark:bg-neutral-700"
                    >
                      {i}
                    </Autocomplete.Item>
                  )}
                </Autocomplete.Collection>
              </Autocomplete.List>
            </Autocomplete.Popup>
          </Autocomplete.Positioner>
        </Autocomplete.Portal>
      </Autocomplete.Root>
    </div>
  );
};

export default BandsAutocomplete;
