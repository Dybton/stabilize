import { Svg, Path } from "react-native-svg";

export const ArrowIconLeft = ({ color = "black", rotate = false }) => {
  return (
    <Svg width='12' height='18' viewBox='0 0 24 24' fill='none'>
      <Path
        d='M16.2467 0.571146L0.793724 14.2219C0.544776 14.442 0.344944 14.7149 0.207939 15.0221C0.0709349 15.3292 0 15.6632 0 16.0013C0 16.3393 0.0709349 16.6734 0.207939 16.9805C0.344944 17.2877 0.544776 17.5606 0.793724 17.7806L16.2467 31.4314C17.7217 32.7342 20 31.6541 20 29.6521V2.34659C20 0.344577 17.7217 -0.735533 16.2467 0.571146Z'
        fill={color}
      />
    </Svg>
  );
};
