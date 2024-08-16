
export default function favouriteMovieBreakpoints() {
    const breakpoints = [
        {
            breakpoint: 4000,
            settings: {
                slidesToShow: 6,
            }
        },
        {
            breakpoint: 3400,
            settings: {
                slidesToShow: 5,
                slidesToScroll: 5,
            }
        },
        {
            breakpoint: 2940,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 4,
            }
        },
        {
            breakpoint: 2420,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3
            }
        },
        {
            breakpoint: 1900,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2
            }
        },
        {
            breakpoint: 1360,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ]
    return breakpoints;
}