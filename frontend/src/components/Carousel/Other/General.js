
export function favouriteMovieBreakpoints() {
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

export function homepageBreakpoints() {
    const breakpoints = [
        {
            breakpoint: 2850,
            settings: {
                slidesToShow: 5,
                slidesToScroll: 5,
                infinite: true,
                dots: false
            }
        },
        {
            breakpoint: 2570,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 4,
                initialSlide: 2
            }
        },
        {
            breakpoint: 2035,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1
            }
        },
        {
            breakpoint: 1530,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2
            }
        },
        {
            breakpoint: 1000,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ]
    return breakpoints;
}