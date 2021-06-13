import { useState, useEffect } from 'react';
import Count from './Count';
import classNames from 'classnames';
import MutationTrigger from './MutationTrigger';
import CardProps from '../interfaces';
import {
  CardWrapper,
  SmallLoadingScreen,
  SmallLoadingScreenInner,
  SmallLoadingScreenCard,
  CardWrapperInner,
  FixedCircle,
  CompressionCircle,
  CircleContainer
} from './Card.styles';

interface ComputeProps {
  before: number;
  after: number;
}

function Card({
  chunk_name,
  before_compression_total_bytes,
  after_compression_total_bytes,
}: CardProps) {
  const [isCompressed, setIsCompressed] = useState(
    after_compression_total_bytes !== null
  );
  const [loadModal, setLoadModal] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);

  const getScale = ({ before, after }: ComputeProps): number => {
    const x = after / before;
    if (!x) {
      return 1;
    }
    return x;
  };

  const getCompressionRatio = ({ before, after }: ComputeProps): number => {
    if (!after) {
      return 0;
    }
    return parseFloat((before / after).toFixed(2));
  };

  const compressionRatio: number = getCompressionRatio({
    before: before_compression_total_bytes,
    after: after_compression_total_bytes,
  });

  const circleClassNames = classNames({
    'ts-compression__grid-item__circle': true,
    [`ts-compression__grid-item__circle--compressed`]: isCompressed,
    [`ts-compression__grid-item__circle--decompressed`]: !isCompressed,
  });

  useEffect(() => {
    setLoadModal(false);
    setIsCompressed(after_compression_total_bytes !== null);
    // setFirstLoad(false);
  }, [after_compression_total_bytes]);

  // useEffect(() => {
  //   setFirstLoad(false);
  // }, [])

  return (
    <CardWrapper>
      <SmallLoadingScreen loadModal={loadModal}>
        <SmallLoadingScreenInner>
          <SmallLoadingScreenCard>
            <svg viewBox="0 0 108 108">
              <circle cx="54" cy="54" r="51.5"></circle>
            </svg>
          </SmallLoadingScreenCard>
        </SmallLoadingScreenInner>
      </SmallLoadingScreen>
      <CardWrapperInner>
        <h4>{chunk_name}</h4>
        <CircleContainer>
          <FixedCircle>
            <svg
              width="160"
              height="160"
              viewBox="0 0 160 160"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="80"
                cy="80"
                r="78"
                strokeWidth="2"
                stroke="gray"
                fill="white"
              />
            </svg>
          </FixedCircle>
          <CompressionCircle isCompressed={isCompressed} firstLoad={firstLoad}>
            <svg
              width="160"
              height="160"
              viewBox="0 0 160 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                transform: `scale(${getScale({
                  before: before_compression_total_bytes,
                  after: after_compression_total_bytes,
                })})`,
              }}
            >
              <circle
                cx="80"
                cy="80"
                r="64"
              />
              <circle cx="80" cy="80" r="78" strokeWidth="2" />
            </svg>
          </CompressionCircle>
        </CircleContainer>
        <div className="ts-compression__grid-item__info">
          <div>
            <h4>Before Compression</h4>
            <Count
              prefix=""
              suffix=" bytes"
              start={before_compression_total_bytes}
              end={before_compression_total_bytes}
            />
          </div>
          <div>
            <h4>After Compression</h4>
            <Count
              prefix=""
              suffix=" bytes"
              start={before_compression_total_bytes}
              end={after_compression_total_bytes}
            />
          </div>
        </div>
        <Count
          prefix="Compression Ratio: "
          suffix=""
          end={compressionRatio}
          decimals={2}
        />
        <MutationTrigger
          setLoadModal={setLoadModal}
          chunkName={chunk_name}
          mutationType={isCompressed ? 'decompress' : 'compress'}
        />
      </CardWrapperInner>
    </CardWrapper>
  );
}

export default Card;
