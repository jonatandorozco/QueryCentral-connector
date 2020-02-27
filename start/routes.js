'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {
  Route.post('/databases', 'ConnectionController.getDatabases')
  Route.post('/users', 'ConnectionController.getUsers')
  Route.post('/test', 'ConnectionController.test')
}).prefix('/connection')

Route.group(() =>{
  Route.post('/tables', 'DatabaseController.getTables')
  Route.post('/views', 'DatabaseController.getViews')
  Route.post('/functions', 'DatabaseController.getFunctions')
  Route.post('/procedures', 'DatabaseController.getProcedures')
  Route.post('/triggers', 'DatabaseController.getTriggers')
}).prefix('/database')
