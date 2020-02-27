'use strict'

const mysql = require('mysql')

class DatabaseController {
  async getTables ({ request, response }) {
    const data = request.post()

    switch (data.connection.type) {
      case 'mysql':
        const connection = mysql.createConnection({
          host: data.connection.host,
          user: data.connection.username,
          password: data.connection.password,
          port: data.connection.port,
          database: data.database
        })

        const asyncConnect = () => {
          return new Promise((resolve, reject) => {
            connection.connect(function (err) {
              if (err) {
                resolve({
                  success: false,
                  error: err
                })
              } else {
                resolve({
                  success: true
                })
              }
            })
          })
        }

        const connectionTestResult = await asyncConnect()
        if (connectionTestResult.success === true) {
          const asyncGetTables = (connection) => {
            return new Promise((resolve, reject) => {
              connection.query(`SHOW FULL TABLES WHERE table_type='BASE TABLE';`, (err, result) => {
                if (err) reject(err)
                resolve(result)
              })
            })
          }

          const objects = (await asyncGetTables(connection)).map((table, index) => {
            const _table = {
              id: index,
              name: Object.values(table)[0],
              type: 'table'
            }
            return _table
          })

          return objects
        }
        break
    }
  }

  async getViews ({ request, response }) {
    const data = request.post()

    switch (data.connection.type) {
      case 'mysql':
        const connection = mysql.createConnection({
          host: data.connection.host,
          user: data.connection.username,
          password: data.connection.password,
          port: data.connection.port,
          database: data.database
        })

        const asyncConnect = () => {
          return new Promise((resolve, reject) => {
            connection.connect(function (err) {
              if (err) {
                resolve({
                  success: false,
                  error: err
                })
              } else {
                resolve({
                  success: true
                })
              }
            })
          })
        }

        const connectionTestResult = await asyncConnect()
        if (connectionTestResult.success === true) {
          const asyncGetTables = (connection) => {
            return new Promise((resolve, reject) => {
              connection.query(`SHOW FULL TABLES WHERE table_type='VIEW';`, (err, result) => {
                if (err) reject(err)
                resolve(result)
              })
            })
          }

          const objects = (await asyncGetTables(connection)).map((table, index) => {
            const _table = {
              id: index,
              name: Object.values(table)[0],
              type: 'table'
            }
            return _table
          })

          return objects
        }
        break
    }
  }
}

module.exports = DatabaseController
