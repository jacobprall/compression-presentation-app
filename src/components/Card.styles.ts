import styled, { keyframes } from 'styled-components';

interface LoadScreenProps {
  loadModal: boolean;
}

interface CompressionCircleProps {
  isCompressed: boolean;
  firstLoad: boolean;
}

interface compressAnimationProps {
  isCompressed: boolean;
  inner: boolean;
}

const spinner = keyframes`
  0% {
    stroke-dashoffset: ${0.66 * 108};
    transform: rotate(0deg);
  }
  50% {
    stroke-dashoffset: ${3.14 * 108};
    transform: rotate(540deg);
    transform: rotate(720deg);
  }
  100% {
    stroke-dashoffset: ${0.66 * 108};
    transform: rotate(1080deg);
  }
`;

const compressAnimation = ({
  isCompressed,
  inner,
}: compressAnimationProps) => keyframes`
  0% {
    ${inner ? 'fill' : 'stroke'}: ${isCompressed ? '#141e35' : '#fdb515'};
  }
  100% {
     ${inner ? 'fill' : 'stroke'}: ${isCompressed ? '#fdb515' : '#141e35'};
  }
`;

export const CardWrapper = styled.div`
  padding: 32px 32px 32px 32px;
  position: relative;
  border: 1px solid gray;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  background: white;
  border: 1px solid #c5ddfc;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  z-index: 1;
`;

export const CardWrapperInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  & > button {
    position: relative;
    z-index: 12;
  }

  & > h4 {
    font-family: 'Inter', sans-serif;
    font-size: 24px;
    font-weigth: 700;
    line-height: 28px;
    letter-spacing: -0.01em;
    color: #141e35;
    margin-bottom: 16px;
  }

  & > span {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    line-height: 24px;
    letter-spacing: -0.01em;
    color: -0.01em;
    margin: 16px 0px;
    font-weight: 700;
  }
`;

export const SmallLoadingScreen = styled.div`
  display: ${(props: LoadScreenProps) => (props.loadModal ? 'flex' : 'none')};
  position: absolute;
  z-index: 5;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.05);
  align-items: center;
  justify-content: center;
`;

export const SmallLoadingScreenInner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SmallLoadingScreenCard = styled.div`
  & > svg {
    width: 108px;
    height: 108px;
    & > circle {
      fill: transparent;
      stroke: #5b9cf2;
      stroke-width: 4;
      stroke-linecap: round;
      stroke-dasharray: ${3.14 * 108};
      transform-origin: ${0.5 * 108}px ${0.5 * 108}px 0;
      animation: ${spinner} 4s linear infinite;
    }
  }
`;

export const CircleContainer = styled.div`
  flex-grow: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

export const FixedCircle = styled.div`
  position: absolute;
  top: 0;
`;

export const CompressionCircle = styled.div`
  display: flex;
  justify-content: center;

  & > svg {
    transition: transform 3s ease-out;

    & > circle:first-child {
      animation: ${(props: CompressionCircleProps) => !props.firstLoad &&
          compressAnimation({ isCompressed: props.isCompressed, inner: true })}
        3s ease-out;
      fill: ${(props: CompressionCircleProps) =>
        props.isCompressed ? '#fdb515' : '#141e35'};
    }

    & > circle:last-child {
      animation: ${(props: CompressionCircleProps) => !props.firstLoad &&
          compressAnimation({ isCompressed: props.isCompressed, inner: false })}
        3s ease-out;
      stroke: ${(props: CompressionCircleProps) =>
        props.isCompressed ? '#fdb515' : '#141e35'};
    }
  }
`;
