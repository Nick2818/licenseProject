import { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import img1 from "../homepage/img/1.jpg";
import img2 from "../homepage/img/2.jpg";
import img3 from "../homepage/img/3.jpg";
import img4 from "../homepage/img/4.jpg";
function ControlledCarousel() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      <Carousel.Item>
        <img className=" img-fluid" src={img1} alt="First slide" />
      </Carousel.Item>
      <Carousel.Item>
        <img className=" img-fluid" src={img3} alt="Second slide" />
      </Carousel.Item>
      <Carousel.Item>
        <img className=" img-fluid" src={img2} alt="Third slide" />
      </Carousel.Item>

      <Carousel.Item>
        <img className=" img-fluid" src={img4} alt="Third slide" />
      </Carousel.Item>
    </Carousel>
  );
}

export default ControlledCarousel;
