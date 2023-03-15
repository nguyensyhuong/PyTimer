export default {
    simi_simivideo_40 : {
product: require('./plugins/simi_simivideo_40/product').default,
},
simi_paypalexpress_40 : {
product: require('./plugins/simi_paypalexpress_40/product').default,
},
simi_simiproductreview_40 : {
product: require('./plugins/simi_simiproductreview_40/product').default,
},
simi_simicouponcode_40 : {
cart: require('./plugins/simi_simicouponcode_40/cart').default,
checkout: require('./plugins/simi_simicouponcode_40/checkout').default,
},
simi_fblogin_40 : {
login: require('./plugins/simi_fblogin_40/login').default,
},
customize : {
category: require('./customize/category').default,
standard: require('./customize/standard').default,
product: require('./customize/product').default,
products: require('./customize/products').default,
},

}
