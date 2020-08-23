import * as React from 'react';
import Svg, { Polygon } from 'react-native-svg';

const PenNote = (props) => {
  return (
    <Svg width={141} height={141} viewBox="0 0 141.73 141.73" {...props}>
      <Polygon points="30.881,43.085 90.071,43.085 86.495,47.323 36.442,47.323 36.178,100.288 96.161,100.288 96.161,79.366 100.796,75.263 100.796,104.923 30.881,104.923" />
      <Polygon points="75.372,66.522 89.144,79.632 68.752,87.046" />
      <Polygon points="77.358,64.404 117.349,22.296 117.349,33.022 82.126,69.038" />
      <Polygon points="85.966,72.577 117.349,41.099 117.349,52.222 91.262,77.778" />
    </Svg>
  );
};

export default PenNote;
