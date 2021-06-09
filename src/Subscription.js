import React, { useEffect, useState } from 'react';
import { useMutation, useSubscription, gql } from '@apollo/client';
import Button from './components/button';
import Card from './components/card';
import { ChoiceGroup } from '@timescale/web-styles';
import './styles/subscription.scss';

const Subscription = () => {
  const { loading, error, data } = useSubscription(
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
  const [compressAllComplete, setCompressAllComplete] = useState(false);
  const [allChunks, setAllChunks] = useState([]);

  // TO DO - SORTING
  // const [sortBy, setSortBy] = useState('compressionRatio');

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

  // const handleSelect = (val) => {
  //   setSortBy(val);
  // };

  // const choiceGroupData = {
  //   type: 'radio',
  //   label: 'Sort By:',
  //   options: [
  //     { label: 'Compression Ratio', value: 'compressionRatio' },
  //     {
  //       label: 'Before Compression Size',
  //       value: 'before_compression_total_bytes',
  //     },
  //   ],
  // };

  useEffect(() => {
    // start up loading screen
    if (data === undefined) {
      setLoadModal(true);
    } else {
      setLoadModal(false);
      setAllChunks(data.chunks_with_compression.map((chunk) => chunk.chunk_name))
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

        <div className="ts-compression__grid">
          {data && data.chunks_with_compression.map((chunk) => <Card {...chunk} />)}
        </div>
        <div className="ts-compression__buttons">
          {/* TO DO - COMPRESS ALL, DECOMPRESS ALL, SORT */}
          {/* <Button
            isCompressed={compressAllComplete}
            setLoadModal={setLoadModal}
            chunks={allChunks}
            
          /> */}
          {/* <Button 
            jobComplete={false}
            setLoadModal={setLoadModal}
            buttonType='addData'
            label='ADD DATA'
          /> */}
          {/* <ChoiceGroup
            label="Sort By: "
            {...choiceGroupData}
            onChange={(val) => handleSelect(val)}
            value={sortBy}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default Subscription;
