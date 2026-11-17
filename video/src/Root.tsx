import { Composition } from "remotion";
import { FoodCarousel } from "./FoodCarousel";

export const RemotionRoot: React.FC = () => {
  return (
    // Seamless 10s loop for the website hero. Square, with the dishes kept in the
    // middle, so it crops cleanly to the wide desktop half and the phone band.
    <Composition
      id="HeroFood3D"
      component={FoodCarousel}
      durationInFrames={300}
      fps={30}
      width={900}
      height={900}
    />
  );
};
