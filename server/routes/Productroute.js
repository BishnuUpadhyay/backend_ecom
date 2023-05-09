const express = require('express')
const router = express.Router()
const {getAllProduct,createProduct,updateProduct, deleteProduct, getProductDetail, createProductReview, getAllReviews, deleteReview} =require('../controller/Productcontroller');
const { isAuthenticatedUser,authorizedRoles } = require('../middleware/auth');



// router.get('/products',getAllProduct)
router.route('/products').get( getAllProduct);
router.route('/product/new').post(createProduct)

router.route('/product/:id').put(isAuthenticatedUser,authorizedRoles('admin') ,updateProduct).delete(isAuthenticatedUser,authorizedRoles('admin') ,deleteProduct).get(getProductDetail)
router.route('/review').put(isAuthenticatedUser,createProductReview)
router.route('/reviews').get(getAllReviews).delete(isAuthenticatedUser ,deleteReview)
module.exports =router