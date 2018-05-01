/*jslint devel: true, nomen: true, sloppy: true, browser: true, regexp: true*/
/*global $*/
// @ts-nocheck
//NO MORE CUSTOMIZATION BELOW THIS POINT
var top10CarouselJS = document.querySelector('.js-top-ten-carousel'), //CONTAINER FOR ONLY TOP 10 CELLS
    indexBannerTop = document.getElementById('index-banner-top'), //FIRST BANNER ANCHOR
    indexBannerTopImg = indexBannerTop.getElementsByTagName('img')[0], //FIRST BANNER IMAGE
    indexBannerZone2Banner1 = document.getElementById('index-banner-mid-large'), //SECOND BANNER - LARGE - ANCHOR
    indexBannerZone2Banner1Img = indexBannerZone2Banner1.getElementsByTagName('img')[0], //SECOND BANNER - LARGE - IMAGE
    indexBannerZone2Banner2 = document.getElementById('index-banner-mid-small'), //SECOND BANNER - SMALL - ANCHOR
    indexBannerZone2Banner2Img = indexBannerZone2Banner2.getElementsByTagName('img')[0], //SECOND BANNER - SMALL - IMAGE
    indexBannerZone3 = document.getElementById('index-banner-bottom'), //THIRD BANNER ANCHOR
    indexBannerZone3Banner1 = indexBannerZone3.getElementsByTagName('img')[0], //THIRD BANNER IMAGE
    bbBrand = "bb:brand", //BRAND - SET FOR AJAX JSON DATA
    bbPromos = "bb:promotions", //PROMOS - SET FOR AJAX JSON DATA
    bbSkuGroups = "bb:skugroups", //SKUGROUPS - SET FOR AJAX JSON DATA
    bbSkuImage = "bb:image", //SKUIMAGE - SET FOR AJAX JSON DATA
    bbElite = 'bb:b-elite-badge', //FREE SHIPPING - SET FOR AJAX JSON DATA
    bbTarget = "bb:target", //URLS - SET FOR AJAX JSON DATA
    i, //GENERAL VARIABLE FOR LOOPS
    product,
    topTenCarouselInitial,
    onSaleCarouselInitial,
    popularProdsCarouselInitial;
function GetProduct(data) { //CONSTRUCTOR FOR GET PRODUCTS
    //data - Array/Object of individual product data sent from other function
    var d = data;
    if (d.hasOwnProperty('brandName')) { //PAGES WITH MORE THAN 1 PRODUCT
        this.productName = d.displayTitle.split(' - ')[0]; //PRODUCT NAME - REMOVE THE FLAVOR FROM THE TOP 10 PAGES
        this.brandName = d.brandName; //BRAND NAME
        this.comboName = function () { //COMBINE NAMES TOGETHER - CAN BE USED IN FUTURE
            return this.productName + " " + this.brandName;
        };
    } else { //STATIC PAGES
        this.productName = d.name; //PRODUCT NAME
        this.brandName = d._embedded[bbBrand].label; //BRAND NAME
        this.comboName = function () { //COMBINE NAMES TOGETHER - CAN BE USED IN FUTURE
            return this.productName + " " + this.brandName;
        };
    }
    this.imgURL = d._links[bbSkuImage][0].href.replace('{?resolution}', '').replace('_450_', '_130_'); //PRODUCT IMG URL - CHANGE FROM 450px TO 130px
    this.ratingValue = function () { //GET RATINGS INFO
        try {
            if (d.rating.hasOwnProperty('count')) {
                if (d.rating.value.toFixed(1) === "10.0") { //IF RATING IS 10 TAKE THE ".0" OFF SO IT FITS IN RATING BOX
                    return ["10", d.rating.count.toLocaleString()];
                } else { //ELSE THE RATING IS WHATEVER THE DATA SAYS IT IS
                    return [d.rating.value.toFixed(1), d.rating.count.toLocaleString()];
                }
            }
        } catch (e) { //WILL CATCH IF NO RATINGS ARE AVAILABLE
            return ["N/A", "0"]; //IF NO RATINGS ARE AVAILABLE
        }
    };
    try {
        this.pageURL = d._links[bbTarget].href;
    } catch (e) {
        this.pageURL = d._links.canonical.href;
    }
    this.violator = function () {
        if (d.hasOwnProperty('violators')) {
            try { //TRY CATCH TO MAKE SURE SCRIPT CONTINUES IF THERE ARE ISSUES PARSING
                if (d.violators[0].hasOwnProperty('text')) { //SEE IF ITEM HAS A VIOLATOR TAG
                    return [d.violators[0].text, d.violators[0].color]; //SET VIOLATOR TAG TEXT IF TAG TEXT IS PRESENT IN DATA
                } else { //ELSE THERE IS NO VIO TAG
                    return false; //SETTING TO FALSE SO CELL CREATION DOESNT GET A VIOTAG
                }
            } catch (e) { //WILL CATCH ERRORS AND ALLOW CODE TO CONTINUE
                return false; //IF ERROR HAPPENS THE PRODUCT WILL NOT GET A VIO TAG
            }
        } else if (d.hasOwnProperty('violator')) {
            try { //TRY CATCH TO MAKE SURE SCRIPT CONTINUES IF THERE ARE ISSUES PARSING
                for (i = 0; i < d._embedded[bbSkuGroups]._embedded.item.length; i += 1) {
                    if (d._embedded[bbSkuGroups]._embedded.item[i].title !== "null") { //SEE IF ITEM HAS A VIOLATOR TAG
                        return [d._embedded[bbPromos]._embedded.item[i].title, "green"]; //SET VIOLATOR TAG TEXT IF TAG TEXT IS PRESENT IN DATA
                    } else {
                        return false;
                    }
                }
            } catch (e) { //WILL CATCH ERRORS AND ALLOW CODE TO CONTINUE
                return false; //IF ERROR HAPPENS THE PRODUCT WILL NOT GET A VIO TAG
            }
        }
    };
    this.freeShipping = function () {
        try { //TRY CATCH TO MAKE SURE SCRIPT CONTINUES IF THERE ARE ISSUES PARSING
            if (d._links.hasOwnProperty(bbElite)) { //CHECK TO SEE IF THE ITEM IS FREE SHIPPING ELIGIBLE IN DATA
                return true; //SET FREE SHIPPING TO TRUE
            } else {
                return false; //ELSE SET FREE SHIPPING TO FALSE
            }
        } catch (e) { //WILL CATCH ERRORS AND ALLOW CODE TO CONTINUE
            return false; //IF ERROR HAPPENS THE PRODUCT WILL NOT SHOW FREE SHIPPING ELIGIBLE
        }
    };
    this.createCell = function (appendTo) {
        var cell = document.createElement('a'),             //CREATE OVERALL CELL CONTAINER
            imgDiv = document.createElement('div'),         //CREATE DIV FOR PRODUCT IMAGE
            bottleImg = document.createElement('img'),      //CREATE BOTTLE IMAGE
            textDiv = document.createElement('div'),        //CREATE DIV FOR TEXT ELEMENTS IN CELL
            vioDiv = document.createElement('div'),         //CREATE VIO TAG DIV
            vioTextC = document.createElement('h3'),        //CREATE VIO TAG TEXT ELEMENT
            brandName = document.createElement('h3'),       //CREATE BRAND NAME TEXT ELEMENT
            prodName = document.createElement('h4'),        //CREATE PRODUCT NAME TEXT ELEMENT
            shipImg = document.createElement('img'),        //CREATE FREE SHIPPING IMAGE
            reviewNumDiv = document.createElement('div'),   //CREATE DIV FOR REVIEW NUMBERS
            color;
        cell.setAttribute('href', this.pageURL);            //SET CELL URL
        cell.classList.add('product');                  //SET OVERALL CELL CLASS
        imgDiv.classList.add('product__img-wrapper');          //SET IMAGE CELL CLASS
        textDiv.classList.add('carousel__productText');           //SET TEXT DIV CLASS
        vioDiv.classList.add('vio-text');             //SET VIO TAG DIV CLASS
        brandName.classList.add('product__brand');        //SET BRAND NAME CLASS
        reviewNumDiv.classList.add('product__rating__review-badge');//SET REVIEWS NUMBER CLASS
        prodName.classList.add('product__name');
        bottleImg.setAttribute('src', this.imgURL);         //SET BOTTLE IMAGE SOURCE
        bottleImg.setAttribute('alt', this.productName);    //SET BOTTLE IMAGE ALT TEXT
        cell.appendChild(imgDiv);                           //APPEND IMAGE DIV TO CELL
        imgDiv.appendChild(bottleImg);                      //APPEND BOTTLE IMAGE TO IMAGE DIV
        textDiv.appendChild(vioDiv);                        //APPEND VIO DIV TO TEXT DIV
        vioDiv.appendChild(vioTextC);                       //APPEND VIO TEXT TO VIO DIV
        textDiv.appendChild(prodName);                      //APPEND PRODUCT NAME TO TEXT DIV
        textDiv.appendChild(brandName);                     //APPEND BRAND NAME TO TEXT DIV
        cell.appendChild(textDiv);                          //APPEND TEXT DIV TO PRODUCT CELL
        if (this.violator() !== false) {                    //IF VIO TAG DOES NOT EQUAL FALSE
            color = this.violator()[1];
            vioTextC.innerHTML = this.violator()[0];        //SET VIOLATOR TAG TEXT
            vioDiv.style.backgroundImage = 'url(' + indexOptions.vioTagImg + ')'; //SET VIOLATOR TAG DIV BACKGROUND IMAGE (GREEN TAG)
            if (color === "green" || color === "vio-green") { //IF VIO TAG HAS GREEN COLOR SPECIFIED
                vioTextC.style.color = "#62bd19";           //SET VIO TAG TO GREEN
            } else if (color !== "green" || color !== "vio-green") { //IF VIO TAG HAS RED OR OTHER COLOR SPECIFIED
                vioTextC.style.color = color;               //SET VIO TAG TO RED
                vioDiv.style.backgroundImage = 'none';      //REMOVE VIO TAG IMAGE FROM BACKGROUND OF DIV
                vioDiv.style.paddingLeft = 0;               //REMOVE PADDING FOR THE BACKGROUND IMG
            }
        } else {
            vioTextC.innerHTML = "";
        }
        brandName.innerHTML = this.brandName;               //ADD BRAND NAME TEXT TO ELEMENT
        prodName.innerHTML = this.productName;              //ADD PRODUCT NAME TEXT TO ELEMENT
        reviewNumDiv.innerHTML = this.ratingValue()[0];     //SET RATING NUMBER
        imgDiv.appendChild(reviewNumDiv);                //PREPEND THE REVIEW NUMBERS DIV TO REIVEW TEXT DIV
        if (this.freeShipping() === true) {                 //IF IS FREE SHIPPING ELIGIBLE
            shipImg.setAttribute('src', indexOptions.freeShipImg);       //GIVE SHIPPING IMAGE A SRC - CAN CHANGE IN OPTIONS
            shipImg.classList.add('product__free-shipping-badge');          //SET SHIPPING IMAGE CLASS
            textDiv.appendChild(shipImg);                   //APPEND SHIPPING DIV TO PRODUCT CELL
        }
        appendTo.appendChild(cell);
    };
}
var utilities = {
    fadeOut : function (element) {
        element.classList.add('index__fade');
    },
    fadeIn : function (element) {
        element.classList.remove('index__fade');
    },
    unwrap : function (element) {
        var docFrag = document.createDocumentFragment(),
            child;
        while (element.firstChild) {
            child = element.removeChild(element.firstChild);
            docFrag.appendChild(child);
        }
        element.parentNode.replaceChild(docFrag, element);
    },
    removeChildren : function (element) {
        while (element.hasChildNodes()) { //WHILE ELEMENT HAS CHILDREN
            element.removeChild(element.lastChild); //REMOVE CHILDREN
        }
    },
    imgLoad : function (img) {
        if (!img.complete) {
            return false;
        }
        if (typeof img.naturalWidth !== "undefined" && img.naturalWidth === 0) {
            return false;
        }
        return true;
    },
    loadBanners : function () {
        var width = window.innerWidth,
            screenw;
        if (width > 1000) {
            screenw = countrySpecificData.desktop;
        } else {
            screenw = countrySpecificData.mobile;
        }
        try {
            if (screenw.zone1Banner1URL.length >= 1 || screenw.zone1Banner1Link.length >= 1) {
                indexBannerTopImg.src = screenw.zone1Banner1URL; //SET URL FOR 1ST BANNER
                indexBannerTop.setAttribute('href', screenw.zone1Banner1Link); //SET HREF FOR 1ST BANNER
            } else {
                indexBannerTopImg.src = indexOptions.zone1Banner1FallbackImg; //SET URL FOR 1ST BANNER
                indexBannerTop.setAttribute('href', indexOptions.zone1Banner1FallbackLink); //SET HREF FOR 1ST BANNER
                console.error("Applying Fallback Image For Banner 1 | Please Check User Inputed Code For Errors");
            }
        } catch (e) {
            console.log("Error With Banner - indexBannerZone1 - Please Check Content Regions Are Correct in ExpMan");
        }
        try {
            if (screenw.zone2Banner1URL.length >= 1 || screenw.zone2Banner1Link.length >= 1) {
                indexBannerZone2Banner1Img.src = screenw.zone2Banner1URL; //SET URL FOR 2ND BANNER - LARGE
                indexBannerZone2Banner1.setAttribute('href', screenw.zone2Banner1Link); //SET HREF FOR 2ND BANNER - LARGE
            } else {
                indexBannerZone2Banner1Img.src = indexOptions.zone2Banner1FallbackImg; //SET URL FOR 2ND BANNER - LARGE
                indexBannerZone2Banner1.setAttribute('href', indexOptions.zone2Banner1FallbackLink); //SET HREF FOR 2ND BANNER - LARGE
                console.error("Applying Fallback Image For Banner 2 - Large | Please Check User Inputed Code For Errors");
            }
        } catch (e) {
            console.log("Error With Banner - indexBannerZone2 - Please Check Content Regions Are Correct in ExpMan");
        }
        try {
            if (screenw.zone2Banner2URL.length >= 1 || screenw.zone2Banner2Link.length >= 1) {
                console.log(screenw.zone2Banner2URL);
                indexBannerZone2Banner2Img.src = screenw.zone2Banner2URL;
                indexBannerZone2Banner2.setAttribute('href', screenw.zone2Banner2Link);
            } else { //IF THERE IS A USER INPUTED SMALL BANNER URL
                indexBannerZone2Banner2Img.src = indexOptions.zone2Banner2FallbackImg; //SET URLS/PARAMETERS FOR 2ND BANNER - SMALL
                indexBannerZone2Banner2.setAttribute('href', indexOptions.zone2Banner2FallbackLink);
                console.error("Applying Fallback Image For Banner 2 - Small | Please Check User Inputed Code For Errors");
            }
        } catch (e) {
            console.log("Error With Banner - indexBannerZone2 - Please Check Content Regions Are Correct in ExpMan");
        }
        try {
            if (screenw.zone3Banner1URL.length >= 1 || screenw.zone3Banner1Link.length >= 1) {
                indexBannerZone3Banner1.src = screenw.zone3Banner1URL; //SET URL FOR 3RD BANNER
                indexBannerZone3.setAttribute('href', screenw.zone3Banner1Link); //SET HREF FOR 3RD BANNER
            } else {
                indexBannerZone3Banner1.src = indexOptions.zone3Banner1FallbackImg; //SET URL FOR 3RD BANNER
                indexBannerZone3.setAttribute('href', indexOptions.zone3Banner1FallbackLink); //SET HREF FOR 3RD BANNER
                console.error("Applying Fallback Image For Banner 3 | Please Check User Inputed Code For Errors");
            }
        } catch (e) {
            console.log("Error With Banner - indexBannerZone3 - Please Check Content Regions Are Correct in ExpMan");
        }
    },
    dataRequest: function (url, appendTo, type) { //MAKE AJAX CALLS TO GET INFO FROM PAGES
        //url - URL to get from
        //appendTo - What Container to append to - Vanilla JS
        //type - "Dynamic" = Pages with > 1 product on them, "Static" = Product Pages
        if (window.location.href.indexOf('127') >= 0 || window.location.href.indexOf('localhost') >= 0) {
            url = "https://www.bodybuilding.com" + url;
        }
        var item, itemLength, //GENERAL VARIABLES
            xhr = new XMLHttpRequest();
        try {
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    var data = JSON.parse(xhr.responseText);
                    if (type === 'dynamic') { //DYNAMIC = TOP 10 PAGES, TOP 50 PAGES, ETC, ANY MAJOR PAGE WITH MORE THAN 1 PRODUCT ON IT
                        item = data._embedded.item; //SEE PAGE JSON DATA TO FOLLOW THESE PATHS
                        //ITEM.LENGTH CHECKS TO SEE HOW MANY OF PRODUCT ARE AVAILABLE TO SHOW
                        if (item.length === 50) { //IF NUMBER IS EQUAL TO 50 (TOP 50 PAGE) SCRIPT CHOOSES THE USER ENTERED NUM OF PRODUCTS TO SHOW
                            itemLength = indexOptions.numOfTopSellingToShow;
                        } else { // IF NUMBER IS NOT 50 THEN IT REVERTS TO THE NUMBER OF PRODUCTS IN AJAX DATA
                            itemLength = item.length;
                        }
                        for (i = 0; i < itemLength; i += 1) { //LOOP THROUGH ALL PRODUCT ITEMS IN RETRIEVED DATA
                            if (item[i].hasOwnProperty('displayTitle')) { //MAKES SURE DATA ITEM HAS A PRODUCT NAME
                                product = new GetProduct(item[i]);
                                product.createCell(appendTo);
                            }
                        }
                        var dynamicCarousel = new Carousel({
                            appendTo: ".js-top-ten-carousel",
                            cellsToShow: 4,
                            slidesPerClick: 4,
                            mobileAt: "918px",
                            dots: true
                        });
                    } else if (type === 'static') { //STATIC = PRODUCT PAGES
                        item = data; //SEE PAGE JSON DATA TO FOLLOW THESE PATHS
                        product = new GetProduct(item);
                        product.createCell(appendTo);
                    }
                }
            };
            xhr.open("GET", url, false);
            xhr.setRequestHeader("Accept", "application/hal+json");
            xhr.setRequestHeader("BB-App", "marketing, 1.0.0");
            xhr.send(null);
        } catch (e) {
            console.log('Error With Data Request');
        }
    }
};
(function () { //RUN RIGHT AWAY
    utilities.loadBanners();

    document.querySelector('.js-sales-specials-link').setAttribute('href', indexOptions.salesSpecialsURL); //SET URLS FOR SALES/SPECIALS LINKS
    document.querySelector('.js-top-selling-link').setAttribute('href', indexOptions.topSellingURL); //SET TOP SELLING LINKS
    document.querySelector('.js-top-categories-link').setAttribute('href', indexOptions.topCatURL); //SET TOP CATEGORIES LINKS
    document.querySelector('.js-top-brands-link').setAttribute('href', indexOptions.topBrandsURL); //SET TOP BRAND HEADER LINKS
    topTenCarouselInitial = new Carousel({
        appendTo: ".js-top-ten-carousel",
        cellsToShow: 4,
        slidesPerClick: 4,
        mobileAt: "1000px",
        dots: true
    });
    onSaleCarouselInitial = new Carousel({
        appendTo: ".js-on-sale-carousel",
        arrows: false,
        mobileAt: "900px",
        dots: false
    });
    popularProdsCarouselInitial = new Carousel({
        appendTo : ".js-top-selling-carousel",
        mobileAt: "900px",
        dots: true
    });
    var bArray = [document.querySelector('.js-top-ten-carousel'), document.querySelector('.js-top-selling-carousel'), document.querySelector('.js-on-sale-carousel')];
    try {
        var r;
        for (i = 0; i < bArray.length; i += 1) {
            for (r = 0; r < bArray[i].children.length; r += 1) {
                var prodChild = bArray[i].children[r];
                if (prodChild.querySelector('.vio-text') === null && prodChild.querySelector('.carousel__productVio__container') === null) {
                    var vioDiv = document.createElement('div'); //CREATE VIO TAG DIV
                    vioDiv.classList.add('carousel__productVio__container'); //SET VIO TAG DIV CLASS
                    vioDiv.style.order = '2';
                    vioDiv.style.minHeight = '20px';
                    prodChild.querySelector('.top10__img-wrapper').parentNode.insertBefore(vioDiv, prodChild.querySelector('.top10__img-wrapper').nextSibling);
                }
                prodChild.removeAttribute('id');
            }
        }
    } catch (e) {
        console.log(e);
    }
    //POLYFILL FOR IE AND EDGE LACK OF SUPPORT
    if (!NodeList.prototype.forEach) {
        Object.defineProperty(NodeList.prototype, "forEach", {
            value: Array.prototype.forEach,
            enumerable: true, // This surprised me, but it's how it's defined on both
                              // Chrome and FireFox
            configurable: true,
            writable: true
        });
    }
}());
document.addEventListener("DOMContentLoaded", function () { //WHEN CONTENT IS LOADED ON PAGE
    var catChoose = document.querySelectorAll(".carousel__categories__inner")[0].querySelectorAll("[data-type]"); //ALL THE SIDE BAR CATEGORIES IN TOP 10
    for (i = 0; i < catChoose.length; i += 1) { //LOOP THROGH SIDE BAR CATEGORIES AND ATTACH CLICK LISTENER TO ALL OF THEM
        catChoose[i].addEventListener("click", function (e) { //CLICK EVENT FOR TOP 10 CAROUSEL LEFT BAR - CHANGE PRODUCT CATEGORY
            e = e || window.event; //"e = e || window.event" IS NESSESARY FOR INTERNET EXPLORER TO REGISTER CLICK EVENTS
            var catURL = this.getAttribute('href'), //GET URL FROM CLICKED SIDE BAR ELEMENT
                category = e.currentTarget.getAttribute('data-type'); //GET DATA ATTRIBUTE FROM CLICKED ELEMENT
            if (catURL === undefined || catURL === null) { //IF URL IS PRESENT/VALID - ANY LINK WITH URL WILL GO RIGHT TO THAT URL, NOT CHANGE CAROUSEL
                e.preventDefault(); //PREVENT CLICK FROM DOING ANYTHING IT NORMALLY WOULD
                document.querySelector('.carousel__categories').querySelectorAll('a').forEach(function (node) {
                    node.classList.remove('selected'); //REMOVE BLUE BAR FROM ALL SIDE BARS - SHOWS CURRENT SELECTION 
                });
                Object.getOwnPropertyNames(indexOptions.topTenPages).forEach(function (val) { //LOOP THROUGH THE TOP PRODUCTS OBJECT
                    if (val === category) { //IF THE VALUE (E.G. PROTEIN) IS EQUAL TO CLICKED ELEMENT DATA ATTRIBUTE (E.G. PROTEIN)
                        setTimeout(function () { //SET TIME OUT TO GIVE FADE TIME TO TAKE HOLD TO HIDE FLASHING OF ELEMENTS REPLACING
                            topTenCarouselInitial.destroy();
                            var holderDiv = document.createElement('div');
                            holderDiv.classList.add('js-top-ten-carousel');
                            document.querySelector('.top__ten').appendChild(holderDiv);
                            utilities.dataRequest(indexOptions.topTenPages[category].source, document.querySelector('.js-top-ten-carousel'), 'dynamic'); //GET NEW PRODUCT LIST FROM TOP 10 PAGES
                            document.querySelector('.js-top-10-header-text').textContent = indexOptions.topTenPages[category].viewAllName; //CHANGE TOP 10 HEADER TEXT
                            document.querySelector('.js-top-ten-see-all-text').textContent = indexOptions.topTenPages[category].viewAllName; //CHANGE TOP 10 SEE ALL TEXT
                            document.querySelector('.js-top-ten-see-all-link').setAttribute('href', indexOptions.topTenPages[category].viewAll); // CHANGE TOP 10 SEE ALL HREF
                            var top10CarouselJS = document.querySelector('.js-top-ten-carousel');
                            if (indexOptions.topTenPages[category].addProd.length >= 1) { //IF TOP 10 LISTS HAVE A USER ENTERED PRODUCT TO ADD TO THEM
                                utilities.dataRequest(indexOptions.topTenPages[category].addProd, top10CarouselJS, 'static', false); //CREATE EXTRA PRODUCT CELL
                                top10CarouselJS.removeChild(top10CarouselJS.lastChild.previousSibling); //REMOVE LAST OF ORIGINAL TOP 10, SO CAROUSEL OPPERATES CORRECTLY
                            }
                        }, 150);
                    }
                });
            }
            e.currentTarget.classList.add('selected'); //ADD BLUE BAR TO SELECTED ELEMENT
        });
    }
    for (i = 0; i < document.querySelectorAll('.product').length; i += 1) {
        document.querySelectorAll('.product')[i].removeAttribute('id');
    }
    window.addEventListener("resize", function () { //EVENT LISTEN TO CHECK FOR BROWSER RESIZING / MOSTLY FOR INTERNAL TESTERS
        utilities.loadBanners();
    });
});
window.onload = function () { //WHEN WINDOW IS COMPLETELY 
    var imgLoadArray = [indexBannerTopImg, indexBannerZone2Banner2Img, indexBannerZone2Banner1Img, indexBannerZone3Banner1];
    for (i = 0; i < imgLoadArray.length; i += 1) { //CHECKS THAT ALL BANNER IMAGES HAVE LOADED CORRECTLY AND REPLACES WILL FALLBACK IMAGE IF THERE WAS ERROR
        if (!utilities.imgLoad(imgLoadArray[i])) {
            if (imgLoadArray[i] === indexBannerTopImg) {
                indexBannerTopImg.src = indexOptions.zone1Banner1FallbackImg;
                indexBannerTop.setAttribute('href', indexOptions.zone1Banner1FallbackLink);
                console.error("Applying Fallback Image For Banner 1 | Please Check User Inputed Code For Errors");
            } else if (imgLoadArray[i] === indexBannerZone2Banner2Img) {
                indexBannerZone2Banner2Img.src = indexOptions.zone2Banner2FallbackImg;
                indexBannerZone2Banner2.setAttribute('href', indexOptions.zone2Banner2FallbackLink);
                console.error("Applying Fallback Image For Banner 2 - Small | Please Check User Inputed Code For Errors");
            } else if (imgLoadArray[i] === indexBannerZone2Banner1Img) {
                indexBannerZone2Banner1Img.src = indexOptions.zone2Banner1FallbackImg;
                indexBannerZone2Banner1.setAttribute('href', indexOptions.zone2Banner1FallbackLink);
                console.error("Applying Fallback Image For Banner 2 - Large | Please Check User Inputed Code For Errors");
            } else if (imgLoadArray[i] === indexBannerZone3Banner1) {
                indexBannerZone3Banner1.src = indexOptions.zone3Banner1FallbackImg;
                indexBannerZone3.setAttribute('href', indexOptions.zone3Banner1FallbackLink);
                console.error("Applying Fallback Image For Banner 3 | Please Check User Inputed Code For Errors");
            }
        }
    }
};