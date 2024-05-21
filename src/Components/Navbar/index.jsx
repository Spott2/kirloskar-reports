import React from "react";
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
  LogoContainer,
} from "./NavbarElements";
import logo from "../../../assets/kirlos.png";

const Navbar = () => {
  return (
    <>
      <Nav>
        <Bars />
        <NavMenu>
          <NavLink to="/" activeStyle>
            Output1
          </NavLink>
          <NavLink to="/report2">Output2</NavLink>
          <NavLink to="/report3" activeStyle>
            Output3
          </NavLink>
        </NavMenu>
        <LogoContainer>
          <img src={logo} alt="Logo" />
        </LogoContainer>
      </Nav>
    </>
  );
};

export default Navbar;
