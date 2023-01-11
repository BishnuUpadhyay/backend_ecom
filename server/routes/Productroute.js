const express = require('express')
const router = express.Router()
const {getAllProduct,createProduct,updateProduct, deleteProduct, getProductDetail} =require('../controller/Productcontroller');
const isAuthenticatedUser = require('../middleware/auth');


// router.get('/products',getAllProduct)
router.route('/products').get(isAuthenticatedUser ,getAllProduct);
router.route('/product/new').post(createProduct)

router.route('/product/:id').put(updateProduct).delete(deleteProduct).get(getProductDetail)

module.exports =router