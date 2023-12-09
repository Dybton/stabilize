import { Svg, Rect, Path } from 'react-native-svg';

export const GraphIcon = ({ color = 'black' }) => {
  return (
    <Svg width="30" height="30" viewBox="0 0 16 16" fill="none">
      <Path d="M15 13V14H1.5L1 13.5V0H2V13H15Z" fill={color}/>
      <Path d="M13 3.207L7.854 8.354H7.146L5.5 6.707L1.854 10.354L1.146 9.646L5.146 5.646H5.854L7.5 7.293L12.646 2.146H13.353L15.353 4.146L14.646 4.854L13 3.207Z" fill={color}/>
    </Svg>
  );
}