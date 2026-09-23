import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

interface Props {
  name: string;
  size?: number;
  color: string;
}

export const MarkIcon: React.FC<Props> = ({ name, size = 22, color }) => {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none' as const };
  const stroke = { stroke: color, strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  switch (name) {
    case 'tint':
      return (
        <Svg {...common}>
          <Path d="M12 3.5c2.2 3.6 5.5 6.4 5.5 10a5.5 5.5 0 0 1-11 0c0-3.6 3.3-6.4 5.5-10z" {...stroke} />
        </Svg>
      );
    case 'fire':
      return (
        <Svg {...common}>
          <Path d="M12 3s4 4.2 4 8a4 4 0 0 1-8 0c0-1.2.6-2.2 1.2-3.1C8.4 9.6 8 11 8 12.2 8 15 9.8 17 12 17s4-2 4-4.8C16 8.2 12 3 12 3z" {...stroke} />
        </Svg>
      );
    case 'campground':
      return (
        <Svg {...common}>
          <Path d="M4 19 L12 6 L20 19" {...stroke} />
          <Path d="M8.5 19h7" {...stroke} />
          <Path d="M12 10.5v4" {...stroke} />
        </Svg>
      );
    case 'pack':
      return (
        <Svg {...common}>
          <Rect x="6" y="7" width="12" height="12" rx="2" {...stroke} />
          <Path d="M9 7V6a3 3 0 0 1 6 0v1" {...stroke} />
          <Path d="M9 12h6" {...stroke} />
        </Svg>
      );
    case 'leaf':
      return (
        <Svg {...common}>
          <Path d="M5 19c8-1 12-8 13-14-6 1-13 5-13 14z" {...stroke} />
          <Path d="M9 15c2-2 4-4 8-7" {...stroke} />
        </Svg>
      );
    case 'knot':
      return (
        <Svg {...common}>
          <Path d="M8 7c4 0 4 10 8 10" {...stroke} />
          <Path d="M16 7c-4 0-4 10-8 10" {...stroke} />
          <Circle cx="8" cy="7" r="1.3" fill={color} />
          <Circle cx="16" cy="17" r="1.3" fill={color} />
        </Svg>
      );
    case 'pulse':
      return (
        <Svg {...common}>
          <Path d="M3 12h4l2-5 3 10 2-5h7" {...stroke} />
        </Svg>
      );
    case 'radio':
      return (
        <Svg {...common}>
          <Path d="M6 15a6 6 0 0 1 12 0" {...stroke} />
          <Path d="M9 15a3 3 0 0 1 6 0" {...stroke} />
          <Circle cx="12" cy="17.5" r="1.4" fill={color} />
        </Svg>
      );
    case 'bolt':
      return (
        <Svg {...common}>
          <Path d="M13 3 L6 13h5l-1 8 8-12h-5l0-6z" {...stroke} />
        </Svg>
      );
    case 'food':
      return (
        <Svg {...common}>
          <Path d="M8 4v7M6 4v4a2 2 0 0 0 4 0V4M8 11v9" {...stroke} />
          <Path d="M16 4c1.5 2 1.5 4 0 6v8" {...stroke} />
        </Svg>
      );
    case 'flask':
      return (
        <Svg {...common}>
          <Path d="M10 3h4M11 3v5L6.5 18a3 3 0 0 0 2.6 4h5.8a3 3 0 0 0 2.6-4L13 8V3" {...stroke} />
        </Svg>
      );
    case 'users':
      return (
        <Svg {...common}>
          <Circle cx="9" cy="9" r="2.2" {...stroke} />
          <Circle cx="16" cy="10" r="1.8" {...stroke} />
          <Path d="M4.5 18c.6-2.4 2.4-3.6 4.5-3.6S13 15.6 13.5 18" {...stroke} />
          <Path d="M14 14.6c1.6-.2 3 .6 3.8 2.4" {...stroke} />
        </Svg>
      );
    case 'lock':
      return (
        <Svg {...common}>
          <Rect x="6" y="11" width="12" height="9" rx="2" {...stroke} />
          <Path d="M8.5 11V8.5a3.5 3.5 0 0 1 7 0V11" {...stroke} />
        </Svg>
      );
    case 'book':
      return (
        <Svg {...common}>
          <Path d="M5 5.5h6.2A2.8 2.8 0 0 1 14 8.3V19H7.2A2.2 2.2 0 0 0 5 21.2V5.5z" {...stroke} />
          <Path d="M19 5.5h-6.2A2.8 2.8 0 0 0 10 8.3V19h6.8A2.2 2.2 0 0 1 19 21.2V5.5z" {...stroke} />
        </Svg>
      );
    default:
      return (
        <Svg {...common}>
          <Circle cx="12" cy="12" r="4" {...stroke} />
        </Svg>
      );
  }
};
