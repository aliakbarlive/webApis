import React, { memo } from 'react';

import { geoCentroid } from 'd3-geo';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation,
} from 'react-simple-maps';
import { Card, CardBody } from 'reactstrap';

import allStates from '../data/allstates.json';
const geoUrl = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

const offsets = {
  VT: [50, -8],
  NH: [34, 2],
  MA: [30, -1],
  RI: [28, 2],
  CT: [35, 10],
  NJ: [34, 1],
  DE: [33, 0],
  MD: [47, 10],
  DC: [49, 21],
};

const get_state_color = (percent) => {
  let color = {
    0: '#F49AC2',
    1: '#FFC1CC',
    2: '#FBCCE7',
    3: '#FFD1DC',
    4: '#CF71AF',
    5: '#FFC0CB',
    10: '#FFC8C5',
    20: '#FFD9C5',
    30: '#FFE0C5',
    40: '#FC8EAC',
    50: '#E75480',
    60: '#DE5D83',
    70: '#DE3163',
    80: '#E30B5D',
    90: '#E0115F',
    100: '#C32148',
  };
  let result = '';
  for (var c in color) {
    if (color.hasOwnProperty(c)) {
      if (c >= percent) {
        result = color[c];
        break;
      }
    }
  }
  return result;
};

const setColor = (prop, states, totalOrders) => {
  const { id } = prop;
  const cur = allStates.find((s) => s.val === id);

  let state = null;
  if (!(Object.entries(states).length === 0)) {
    state = states.find((s) => s.shipState === cur.id);
    if (state != null) {
      const percent = (state.stateCount / totalOrders) * 100;
      return get_state_color(percent);
    } else {
      return '#F73665';
    }
  } else {
    return '#F73665';
  }
};

const OrdersMap = ({ setTooltipContent, states, totalOrders }) => {
  return (
    <>
      <ComposableMap data-tip="" projection="geoAlbersUsa">
        <Geographies geography={geoUrl}>
          {({ geographies }) => (
            <>
              {geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  stroke="#FFF"
                  geography={geo}
                  onMouseEnter={() => {
                    const { name } = geo.properties;
                    const { id } = geo;
                    let stateCount = 0;
                    const cur = allStates.find((s) => s.val === id);
                    if (cur != undefined) {
                      if (!(Object.entries(states).length === 0)) {
                        const state = states.find(
                          (s1) => s1.shipState === cur.id
                        );
                        if (state != undefined) {
                          stateCount = state.stateCount;
                        }
                      }
                    }

                    setTooltipContent(`${name} <br/> Orders: ${stateCount}`);
                  }}
                  onMouseLeave={() => {
                    setTooltipContent('');
                  }}
                  style={{
                    default: {
                      fill: setColor(geo, states, totalOrders),
                      outline: 'none',
                    },
                    hover: {
                      fill: '#999',
                      outline: 'none',
                    },
                    pressed: {
                      fill: '#E42',
                      outline: 'none',
                    },
                  }}
                />
              ))}
              {geographies.map((geo) => {
                const centroid = geoCentroid(geo);
                const cur = allStates.find((s) => s.val === geo.id);
                return (
                  <g key={geo.rsmKey + '-name'}>
                    {cur &&
                      centroid[0] > -160 &&
                      centroid[0] < -67 &&
                      (Object.keys(offsets).indexOf(cur.id) === -1 ? (
                        <Marker coordinates={centroid}>
                          <text y="2" fontSize={14} textAnchor="middle">
                            {cur.id}
                          </text>
                        </Marker>
                      ) : (
                        <Annotation
                          subject={centroid}
                          dx={offsets[cur.id][0]}
                          dy={offsets[cur.id][1]}
                        >
                          <text x={4} fontSize={14} alignmentBaseline="middle">
                            {cur.id}
                          </text>
                        </Annotation>
                      ))}
                  </g>
                );
              })}
            </>
          )}
        </Geographies>
      </ComposableMap>
    </>
  );
};

export default memo(OrdersMap);
