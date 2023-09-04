import styled from "styled-components";

export const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;

  nav {
    display: flex;
    gap: 0.5rem;
  }

  a {
    width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(props) => props.theme["gray-100"]};

    border-top: 3px solid transparent;
    border-bottom: 3px solid transparent;
    &:hover {
      border-bottom: 3px solid ${(props) => props.theme["green-500"]};
    }
    &:active {
      color: ${(props) => props.theme["green-500"]};
    }
  }

  div:first-child {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    gap: 0.5em;

    h1 {
      margin: 0;
    }
  }
`;

export const SiteTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${(props) => props.theme["red-300"]};

  span {
    font-weight: 100;
    color: ${(props) => props.theme["green-300"]};
  }
`;
