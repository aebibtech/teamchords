import { FC } from 'react';

interface MainLogoProps {
  size: number;
  className?: string;
}

const MainLogo: FC<MainLogoProps> = ({ size, className }) => (
  <img src="/favicon.png" width={size} height={size} className={className} />
);

export default MainLogo;
