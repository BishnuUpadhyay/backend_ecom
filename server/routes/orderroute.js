const{ newOrder,getSingleOrder, myOrders, getAllOrders, updateOrder, DeleteOrder }= require('../controller/ordercontroller')
const express = require('express')
const router =express.Router()
const { isAuthenticatedUser,authorizedRoles } = require('../middleware/auth');


router.route('/order/new').post(isAuthenticatedUser, newOrder)
router.route('/order/_id').get(isAuthenticatedUser, authorizedRoles("admin"),getSingleOrder)
router.route('/orders/me').get(isAuthenticatedUser, myOrders)
router.route('/admin/orders').get(isAuthenticatedUser, authorizedRoles("admin"),getAllOrders)
router.route('/admin/order/:id').put(isAuthenticatedUser, authorizedRoles("admin"),updateOrder)
                                .delete(isAuthenticatedUser, authorizedRoles("admin"),DeleteOrder)
module.exports = router

