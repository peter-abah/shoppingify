import { ReactNode, ReactElement } from "react";
import { Menu, MenuItem } from "@szhsin/react-menu";
import { MdMoreHoriz } from "react-icons/md";

interface Props {
  menuButton?: ReactElement;
  options: {
    node: ReactNode;
    onClick: () => void;
  }[];
}

function OptionsMenu({ options, menuButton }: Props) {
  // eslint-disable-next-line no-param-reassign
  menuButton ||= (
    <button type="button" className="p-2 rounded-full hover:bg-gray-1">
      <MdMoreHoriz className="text-xl" />
    </button>
  );
  return (
    <Menu
      menuButton={menuButton}
      menuClassName="py-2 bg-white min-w-[6rem] mr-4 shadow-md rounded-md"
    >
      {options.map(({ node, onClick }) => (
        <MenuItem onClick={onClick} className="cursor-pointer px-4 py-1 hover:bg-[#f2f2f2]">
          {node}
        </MenuItem>
      ))}
    </Menu>
  );
}

export default OptionsMenu;