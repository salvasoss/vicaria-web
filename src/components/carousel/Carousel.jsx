import React from 'react';

import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import "./carousel.scss";

const ControlledCarousel = () => {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex,) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel interval = {3000} controls = {false} indicators = {false} activeIndex={index} onSelect={handleSelect} slide = {true}>
      <Carousel.Item as= "div" className='carouselDivImg'>
        <img src='./img/bloque de cilindros.jpg' alt='bloque de cilindros' text="First slide"/>
      </Carousel.Item>
      <Carousel.Item as= "div" className='carouselDivImg'>
        <img src='./img/radiador de calefaccion.jpg' alt=' calefaccion' text="Second slide" />
      </Carousel.Item>
      <Carousel.Item as= "div" className='carouselDivImg'>
        <img src='./img/radiador de auto.jpg' alt='radiador de auto' text="Third slide" />
      </Carousel.Item>
    </Carousel>
  );
}

export default ControlledCarousel;


// const Carousel = () => {
 
//   return (
//     <div id="carouselExampleSlidesOnly" className="carousel slide" data-bs-ride="carousel">
//       <div className="carousel-inner">
//         <div className="carousel-item active">
//           <img src="./img/bloquecilindros.jpg" className="d-block w-100" alt="bloque de cilindros"/>
//         </div>
//         <div className="carousel-item">
//           <img src= './img/radiadorauto.jpg' className="d-block w-100" alt="radiador de auto"/>
//         </div>
//         <div className="carousel-item">
//           <img src="./img/calefaccion.jpg" className="d-block w-100" alt="calefaccion"/>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Carousel;
