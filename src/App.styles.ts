import styled, { keyframes } from 'styled-components';

interface LoadingScreenProps {
  loadModal: boolean;
}

export const SiteWrapper = styled.div`
  display: flex;
  justify-content: center;
  background-color: color($blue, 100);
  width: 100%;
  background-color: #f8fafe;
`;

export const SiteWrapperInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1440px;
  width: 100%;

  & > h2 {
    font-size: 40px;
    font-weigth: 700;
    line-height: 48px;
    letter-spacing: -0.01em;
    color: #141e35;
    font-family: 'Inter', sans-serif;
    margin-bottom: 0px;
    padding-top: 32px;
  }

  & > p {
    font-size: 40px;
    line-height: 48px;
    letter-spacing: -0.01em;
    color: #141e35;
    font-family: 'Inter', sans-serif;
    font-weight: 300;
    padding-bottom: 32px;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 400px);
  max-width: 1400px;
  width: 100%;
  grid-gap: 32px;
  margin-bottom: 64px;
  justify-content: center;
`;

export const LoadingScreen = styled.div`
  position: fixed;
  z-index: 5;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #f8fafe;
  display: ${(props: LoadingScreenProps) =>
    props.loadModal ? 'block' : 'none'};
`;

export const LoadingScreenInner = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: sticky;
  top: 0;
`;

const spinner = keyframes`
  0% {
    stroke-dashoffset: ${(0.66 * 108)};
    transform: rotate(0deg);
  }
  50% {
    stroke-dashoffset: ${(3.14 * 108)};
    transform: rotate(540deg);
    transform: rotate(720deg);
  }
  100% {
    stroke-dashoffset: ${(0.66 * 108)};
    transform: rotate(1080deg);
  }
`;

export const LoadingScreenCard = styled.div`
  padding: 64px 128px;
  background: white;
  border: 1px solid #c5ddfc;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: sticky;
  top: 0;

  & > h2 {
    font-size: 40px;
    font-weigth: 700;
    line-height: 48px;
    letter-spacing: -0.01em;
    color: #141e35;
    font-family: 'Inter', sans-serif;
  }

  & > svg {
    width: 108px;
    height: 108px;
    & > circle {
      fill: transparent;
      stroke: #5b9cf2;
      stroke-width: 4;
      stroke-linecap: round;
      stroke-dasharray: ${(3.14 * 108)};
      transform-origin: ${(0.5 * 108)}px ${(0.5 * 108)}px 0;
      animation: ${spinner} 4s linear infinite;
    }
  }
`;
