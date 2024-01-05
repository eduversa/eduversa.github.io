import React, { useState } from "react";
function NavbarV2() {
  const [activeItem, setActiveItem] = useState("home");

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  const menuItems = ["home", "about", "services", "contact"];

  return (
    <nav>
      <ul>
        {menuItems.map((item) => (
          <li
            key={item}
            className={activeItem === item ? "active" : ""}
            onClick={() => handleItemClick(item)}
          >
            {item}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default NavbarV2;
