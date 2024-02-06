"use strict";
$(document).ready(function () {

    // Query For Header Sticky
    $(window).scroll(function () {
        if ($(window).scrollTop() > 0) {
            $('header').addClass('fixed-header');
        }
        else {
            $('header').removeClass('fixed-header');
        }
    });

    $(window).scroll(function () {
        if ($(window).scrollTop() > 667) {
            $('.floating-nav').addClass('show');
        }
        else {
            $('.floating-nav').removeClass('show');
        }
    });


    // one page floating nav activation 
    $('.float-nav-list').onePageNav()

    $('.course-active, .educator-active, .institue-active, .catalog-left-slider, .cat-type-slider').on('init', function (slick) {
        slick.target.classList.add('right_shadow_active');
    })

    $('.course-active, .educator-active, .institue-slider, .review-active, .catalog-left-slider, .cat-type-slider').on('afterChange', function (slick, currentSlide, nextSlide) {
        if (!currentSlide.$slides[currentSlide.$slides.length - 1].classList.contains('slick-active')) {
            $(this).addClass('right_shadow_active');
        } else {
            $(this).removeClass('right_shadow_active');
        }

        if (!currentSlide.$slides[0].classList.contains('slick-active')) {
            $(this).addClass('left_shadow_active');
        } else {
            $(this).removeClass('left_shadow_active');
        }
    })

    // Slick Activation for Course-area 
    $('.course-active').slick({
        infinite: false,
        speed: 800,
        slidesToShow: 3,
        slidesToScroll: 1,
        nextArrow: '<button type="button" class="slick-next"><i class="far fa-angle-right"></i></button>',
        prevArrow: '<button type="button" class="slick-prev"><i class="far fa-angle-left"></i></button>',
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
        ]
    });

    // Slick Activation for educator-area
    $('.educator-active').slick({
        infinite: false,
        speed: 800,
        slidesToShow: 2,
        slidesToScroll: 1,
        centermode: true,
        nextArrow: '<button type="button" class="slick-next"><i class="far fa-angle-right"></i></button>',
        prevArrow: '<button type="button" class="slick-prev"><i class="far fa-angle-left"></i></button>',
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
        ]
    });


    // Slick Activation for institue-area
    $('.institue-active').slick({
        infinite: false,
        speed: 800,
        slidesToShow: 2,
        slidesToScroll: 1,
        centermode: true,
        nextArrow: '<button type="button" class="slick-next"><i class="far fa-angle-right"></i></button>',
        prevArrow: '<button type="button" class="slick-prev"><i class="far fa-angle-left"></i></button>',
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
        ]
    });

    // Slick Activation for institue-area
    $('.institue-slider').slick({
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        fade: true,
        autoplay: true,
        slidesToScroll: 1,
        arrows: false,
        autoplaySpeed: 1600,
        // nextArrow: '<button type="button" class="slick-next"><i class="fal fa-chevron-circle-right"></i></button>',
        // prevArrow: '<button type="button" class="slick-prev"><i class="fal fa-chevron-circle-left"></i></button>'
    });




    // Slick Activation for expert-area
    $('.expert-slider').slick({
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        fade: true,
        slidesToScroll: 1,
        nextArrow: '<button type="button" class="slick-next"><i class="fal fa-chevron-circle-right"></i></button>',
        prevArrow: '<button type="button" class="slick-prev"><i class="fal fa-chevron-circle-left"></i></button>'
    });


    // Activation Nice-Select for Dropdown 
    $('.selection').niceSelect();

    // Query for Dragable Hamburger Menu 
    const fabElement = document.getElementById("floating-snap-btn-wrapper");
    const burger = document.querySelector('.js-burger');
    let oldPositionX,
        oldPositionY;

    const determinePopupPosition = e => {

        let dropDiv = fabElement.querySelector('.float-nav-list-wrap').getBoundingClientRect();
        let triggerPosition = fabElement.querySelector('.fab-btn').getBoundingClientRect();
        if (triggerPosition.top < dropDiv.height) {
            $(fabElement.querySelector('.float-nav-list-wrap')).css({
                'bottom': 'auto',
                'top': 'calc(100% + 5px)'
            })
            // $(fabElement.querySelector('.float-nav-list-wrap')).addClass('show-down');
        } else if ((window.innerHeight - triggerPosition.bottom) < dropDiv.height) {
            $(fabElement.querySelector('.float-nav-list-wrap')).css({
                'top': 'auto',
                'bottom': 'calc(100% + 5px)'
            })
            // $(fabElement.querySelector('.float-nav-list-wrap')).addClass('show-down');
        }
    }



    const move = (e) => {
        if (!fabElement.classList.contains("fab-active")) {
            if (e.type === "touchmove") {
                fabElement.style.top = e.touches[0].clientY + "px";
                fabElement.style.left = e.touches[0].clientX + "px";
            } else {
                fabElement.style.top = e.clientY + "px";
                fabElement.style.left = e.clientX + "px";
            }
        }
    };
    const mouseDown = (e) => {
        oldPositionY = fabElement.style.top;
        oldPositionX = fabElement.style.left;
        if (e.type === "mousedown") {
            window.addEventListener("mousemove", move);
        } else {
            window.addEventListener("touchmove", move);
        }

        fabElement.style.transition = "none";
    };

    const mouseUp = (e) => {
        if (e.type === "mouseup") {
            window.removeEventListener("mousemove", move);
        } else {
            window.removeEventListener("touchmove", move);
        }
        snapToSide(e);
        fabElement.style.transition = "0.3s ease-in-out left";
    };

    const snapToSide = (e) => {

        const wrapperElement = document.getElementById('main-wrapper');
        const windowWidth = window.innerWidth;
        let currPositionX, currPositionY;
        if (e.type === "touchend") {
            currPositionX = e.changedTouches[0].clientX;
            currPositionY = e.changedTouches[0].clientY;
        } else {
            currPositionX = e.clientX;
            currPositionY = e.clientY;
        }
        if (currPositionY < 50) {
            fabElement.style.top = 50 + "px";
        }
        if (currPositionY > wrapperElement.clientHeight - 50) {
            fabElement.style.top = (wrapperElement.clientHeight - 50) + "px";
        }
        if (currPositionX < windowWidth / 2) {
            fabElement.style.left = 40 + "px";
            fabElement.classList.remove('right');
            fabElement.classList.add('left');
        } else {
            fabElement.style.left = windowWidth - 60 + "px";
            fabElement.classList.remove('left');
            fabElement.classList.add('right');
        }
    };

    fabElement.addEventListener("mousedown", mouseDown);

    fabElement.addEventListener("mouseup", mouseUp);

    fabElement.addEventListener("touchstart", mouseDown);

    fabElement.addEventListener("touchend", mouseUp);
    fabElement.addEventListener("click", (e) => {
        determinePopupPosition()
        if (
            oldPositionY === fabElement.style.top &&
            oldPositionX === fabElement.style.left
        ) {
            burger.classList.toggle('open');
            fabElement.classList.toggle("fab-active");
        }
    });

    $(window).on('load', function () {
        fabElement.style.top = '60%';
        fabElement.style.left = '40px';
    });




    // Slick Activation for institue-area
    $('.review-active').slick({
        infinite: false,
        speed: 800,
        slidesToShow: 3,
        slidesToScroll: 1,
        vertical: true,
        nextArrow: '<button type="button" class="slick-next"><i class="far fa-angle-down"></i></button>',
        prevArrow: '<button type="button" class="slick-prev"><i class="far fa-angle-up"></i></button>'
    });


    // Slick Activation for expert-area
    $('.expert-slider-2').slick({
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplaySpeed: 2000,
        arrows: false,
        autoplay: true,
        vertical: true
    });


    // Slick Activation for institue-area
    $('.catalog-left-slider').slick({
        infinite: false,
        speed: 800,
        slidesToShow: 7,
        slidesToScroll: 1,
        vertical: true,
        nextArrow: '<button type="button" class="slick-next"><i class="far fa-angle-down"></i></button>',
        prevArrow: '<button type="button" class="slick-prev"><i class="far fa-angle-up"></i></button>',
        responsive: [
            {
                breakpoint: 991,
                settings: {
                    vertical: false,
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 767,
                settings: {
                    vertical: false,
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    vertical: false,
                    slidesToShow: 1
                }
            }
        ]
    });



    // Slick Activation cat-type-slider
    $('.cat-type-slider').slick({
        infinite: false,
        speed: 800,
        slidesToShow: 3,
        slidesToScroll: 1,
        vertical: true,
        nextArrow: '<button type="button" class="slick-next"><i class="far fa-angle-down"></i></button>',
        prevArrow: '<button type="button" class="slick-prev"><i class="far fa-angle-up"></i></button>'
    });



}); //jQuery End 






