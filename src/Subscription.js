import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useSubscription, gql } from '@apollo/client';
import Card from './components/card';
import CardInfo from './components/cardInfo';
import { ChoiceGroup } from '@timescale/web-styles';
import './styles/subscription.scss';

const Subscription = () => {
  const { data } = useSubscription(
    gql`
      subscription Chunks {
        chunks_with_compression {
          hypertable_name
          chunk_name
          range_start
          range_end
          before_compression_total_bytes
          after_compression_total_bytes
        }
      }
    `
  );

  const [loadModal, setLoadModal] = useState(false);
  const [, setCompressAllComplete] = useState(false);
  const [, setAllChunks] = useState([]);
  const [cardInfo, setCardInfo] = useState({});
  const [biggestChunk, setBiggestChunk] = useState({});

  const handleBiggestChunk = (chunk) => {
    if (Object.keys(biggestChunk).length === 0) return setBiggestChunk(chunk);
    if (
      biggestChunk.before_compression_total_bytes <
      chunk.before_compression_total_bytes
    )
      return setBiggestChunk(chunk);
    return null;
  };

  const handleCardInfo = (info) => setCardInfo(info);

  // TO DO - SORTING
  const [sortBy, setSortBy] = useState('compressionRatio');

  // const sortData = (data = []) => {
  //   if (sortBy === 'compressionRatio') {
  //     return data.sort((a, b) => {
  //       return (
  //         b.before_compression_total_bytes / b.after_compression_total_bytes -
  //         a.before_compression_total_bytes / a.after_compression_total_bytes
  //       );
  //     });
  //   } else {
  //     return data.sort(
  //       (a, b) =>
  //         b.before_compression_total_bytes - a.before_compression_total_bytes
  //     );
  //   }
  // };

  const handleSelect = (val) => {
    setSortBy(val);
  };

  const choiceGroupData = {
    type: 'radio',
    label: 'Sort By:',
    options: [
      { label: 'Compression Ratio', value: 'compressionRatio' },
      {
        label: 'Before Compression Size',
        value: 'before_compression_total_bytes',
      },
    ],
  };
  const svg =
    typeof window !== 'undefined' && document.getElementById('chunks');
  const chunksRect = svg?.getBoundingClientRect();

  useEffect(() => {
    // start up loading screen
    if (data === undefined) {
      setLoadModal(true);
    } else {
      setLoadModal(false);
      setAllChunks(
        data.chunks_with_compression.map((chunk) => chunk.chunk_name)
      );
    }
  }, [data]);

  useEffect(() => {
    // check if compression is complete
    const compressionComplete = data?.chunks_with_compression.every(
      (x) => x.after_compression_total_bytes !== null
    );

    if (compressionComplete) {
      setCompressAllComplete(true);
      setLoadModal(false);
    } else {
      setCompressAllComplete(false);
    }
  }, [data]);

  const cardInfoClasses = classNames('ts-compression__inner__info__wrapper', {
    'ts-compression__inner__info__wrapper--active': Object.keys(cardInfo).length > 0,
  });

  return (
    <div className="ts-compression">
      <div
        className="ts-compression__loading-screen"
        style={loadModal ? { display: 'block' } : { display: 'none' }}
      >
        <div className="ts-compression__loading-screen__inner">
          <div className="ts-compression__loading-screen__card">
            <h2>Loading...</h2>
            <svg viewBox="0 0 108 108">
              <circle cx="54" cy="54" r="51.5"></circle>
            </svg>
          </div>
        </div>
      </div>
      <div className="ts-compression__inner">
        <h2>Compression</h2>
        <p>Interactive visualization</p>
        <div className="ts-compression__buttons">
          {/* TO DO - COMPRESS ALL, DECOMPRESS ALL, SORT */}
          <ChoiceGroup
            label="Sort By: "
            {...choiceGroupData}
            onChange={(val) => handleSelect(val)}
            value={sortBy}
          />
        </div>
        <div className={cardInfoClasses}>
          <CardInfo {...cardInfo} />
        </div>
        <div className="ts-compression__inner__chunks">
          <svg
            id="chunks"
            width="auto"
            height="auto"
            fill="none"
            className="ts-compression__inner__chunks__cards-wrapper"
            xmlns="http://www.w3.org/2000/svg"
          >
            {data &&
              data.chunks_with_compression
                .filter(
                  (chunk) => !chunk.chunk_name.match(/_hyper_2_[32]_chunk/)
                )
                .map((chunk, index) => (
                  <Card
                    {...chunk}
                    screenDimensions={chunksRect}
                    index={index}
                    handleCardInfo={handleCardInfo}
                    biggestChunk={biggestChunk}
                    handleBiggestChunk={handleBiggestChunk}
                    key={index}
                  />
                ))}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
