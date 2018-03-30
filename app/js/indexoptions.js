var indexOptions = {
    topTenPages: { //TOP TEN CAROUSEL ITEMS
        protein: {
            viewAllName: "Protein Powders", //TOP 10 PAGE TYPE
            source: "/store/best-protein-powders.html", //STORE URL OF TOP 10 PAGE
            viewAll: "/store/protein.htm", //VIEW ALL OF PRODUCT TYPE LINK
            addProd: "" //IF WANT TO REPLACE LAST PRODUCT IN TOP 10 WITH ANOTHER - PRODUCT URL HERE
        },
        preworkout: {
            viewAllName: "Pre-Workouts",
            source: "/store/best-pre-workout-supplements.html",
            viewAll: "/store/goalpreworkout.htm",
            addProd: ""
        },
        aminoacids: {
            viewAllName: "Amino Acids",
            source: "/store/best-amino-acid-supplements.html",
            viewAll: "/store/goalamino.htm",
            addProd: "/store/bodybuilding-com/signature-bcaa.html"
        },
        postworkout: {
            viewAllName: "Post Workouts",
            source: "/store/best-post-workout-supplements.html",
            viewAll: "/store/recovery.htm",
            addProd: "/store/bodybuilding-com/signature-bcaa.html"
        },
        creatines: {
            viewAllName: "Creatine",
            source: "/store/best-creatine-supplements.html",
            viewAll: "/store/creatine.html",
            addProd: ""
        },
        fatburners: {
            viewAllName: "Fat Burners",
            source: "/store/best-fat-burner-supplements.html",
            viewAll: "/store/ephfree.htm",
            addProd: "/store/bodybuilding-com/signature-green-tea.html"
        },
        testboosters: {
            viewAllName: "Test Boosters",
            source: "/store/best-test-booster-supplements.html",
            viewAll: "/store/goalanabolic.htm",
            addProd: "/store/bodybuilding-com/signature-testosterone-booster.html"
        },
        multivitamins: {
            viewAllName: "Multivitamins",
            source: "/store/best-multivitamins.html",
            viewAll: "/store/multi.html",
            addProd: ""
        },
        accessories: {
            viewAllName: "Accessories",
            source: "/store/best-fitness-accessories.html",
            viewAll: "/store/acc.htm",
            addProd: ""
        }
    },
    freeShipImg: "https://artifacts.bbcomcdn.com/bb-resources/2.3.0/free-shipping/free-shipping-with-orders-wrap.svg", //Free shipping image - can change here in case it changes again
    vioTagImg: "https://artifacts.bbcomcdn.com/cms-app/3.1.15/i/bd7b6db14c26fa9d649619c75d960a3150f2b6c5.png", //Vio Tag image - can change here in case it changes again
    salesSpecialsURL: "/store/coupons_promos.html", //Sales and Specials URL
    topSellingURL: "/store/top50.htm", //Top Selling URL
    topCatURL: "/store/type.htm", //Top Categories URL
    topBrandsURL: "/store/listing.htm", //Top Brands URL
    numOfTopSellingToShow: 10, //Number of Top Selling Products To Show In Carousel - Divisible by 6
    euCountries: ["uk", "at", "be", "bg", "hr", "cy", "cz", "dk", "ee", "fi", "fr", "de", "gr", "hu", "ie", "it", "lv", "lt", "lu", "mt", "nl", "pl", "pt", "ro", "sk", "si", "es", "se"],
    zone1Banner1FallbackImg: "https://www.bodybuilding.com/images/merchandising/january-2018/sales_specials_1200x400.jpg",
    zone1Banner1FallbackLink: "https://www.bodybuilding.com/store/coupons_promos.html",
    zone2Banner1FallbackImg: "https://www.bodybuilding.com/images/merchandising/january-2018/top_50_store_bnr_800x560.jpg",
    zone2Banner1FallbackLink: "https://www.bodybuilding.com/store/top50.htm",
    zone2Banner2FallbackImg: "https://www.bodybuilding.com/images/merchandising/january-2018/store_strongest_deals_banner_320x580.jpg", //FALL BACK IMAGE FOR SMALL BANNER IN SECOND BANNER SECTION
    zone2Banner2FallbackLink: "/store/coupons_promos.html", //FALL BACK LINK FOR SMALL BANNER IN SECOND BANNER SECTION
    zone3Banner1FallbackImg: "",
    zone3Banner1FallbackLink: ""
};