import { useEffect } from "react";
function getChunkSize(width, breakpoints) {
    for (let i = 0; i < breakpoints.length; i++) {
        if (width <= breakpoints[i]) {
            return i + 1;
        }
    }
    return 5; // Default value if no breakpoint matches
}
const useWindowResizeEffect = (setWindowWidth) => {
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, [setWindowWidth]);
};

const CarouselArrowStyles = `
@media screen and (max-width: 3340px) {
  .carousel-control-prev,
  .carousel-control-next {
    flex: 1;
    margin: 0 5px;
    width:30px;
  }
  .carousel-control-prev {
    justify-content: flex-start;
  }
  .carousel-control-next {
    justify-content: flex-end;
  }
}
@media screen and (min-width: 3340px) {
  .carousel-control-prev {
    justify-content: flex-end;
  }

  .carousel-control-next {
    justify-content: flex-start;
  }
}
`;
export { CarouselArrowStyles, useWindowResizeEffect, getChunkSize };