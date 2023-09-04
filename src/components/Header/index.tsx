import { HeaderContainer, SiteTitle } from "./styles";
import logo from "../../assets/pomolista.png";
import { Scroll, Timer } from "phosphor-react";
import { NavLink } from "react-router-dom";

export function Header() {
  return (
    <HeaderContainer>
      <div>
        <img src={logo} alt="PomoLista" style={{ width: 50 }} />
        <SiteTitle>
          Pomo<span>Lista</span>
        </SiteTitle>
      </div>
      <nav>
        <NavLink to="/" title="Timer">
          <Timer size={24} />
        </NavLink>
        <NavLink to="/history" title="History">
          <Scroll size={24} />
        </NavLink>
      </nav>
    </HeaderContainer>
  );
}
