import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";

export type Item = {
  id: number;
  name: string;
  value: string | number;
};

interface DropdownProps {
  options: Item[];
  defaultOption: Item;
  selected?: Item;
  onChange: (option: Item) => void;
}

const Dropdown = ({ options, defaultOption, selected, onChange }: DropdownProps) => {
  const [selectedOption, setSelectedOption] = useState(defaultOption);

  return (
    <div className={"top-16"}>
      <Listbox
        value={selectedOption}
        onChange={(value) => {
          setSelectedOption(value);
          onChange(value);
        }}
      >
        <div className='relative mt-1'>
          <Listbox.Button className='relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm'>
            {selected ? selected.name : selectedOption.name}
          </Listbox.Button>
          <Transition as={Fragment} leave='transition ease-in duration-100' leaveFrom='opacity-100' leaveTo='opacity-0'>
            <Listbox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
              {options.map((option) => (
                /* Use the `active` state to conditionally style the active option. */
                /* Use the `selected` state to conditionally style the selected option. */
                <Listbox.Option
                  key={option.id}
                  value={option}
                  className={'relative cursor-default select-none py-2 pl-4 pr-4'}
                >
                  {({ active }) => (
                    <li className={`${active ? "text-blue" : "bg-white text-black"}`}>
                      {/*{selected && <CheckIcon />}*/}
                      {option.name}
                    </li>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default Dropdown;
