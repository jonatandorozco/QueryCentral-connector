'use strict'

const mysql = require('mysql')

class ConnectionController {
  async test ({ request, response }) {
    const data = request.post()

    if (Object.keys(data).length === 0) {
      return response.status(422).json({
        error: {
          message: 'Empty body'
        }
      })
    }

    switch (data.type) {
      case "mysql":
        const connection = mysql.createConnection({
          host: data.host,
          user: data.username,
          password: data.password,
          port: data.port,
          database: ''
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

        if (connectionTestResult.success === false) {
          return response.status(404).json({
            error: {
              message: connectionTestResult.error
            }
          })
        } else {
          return response.status(204).send('')
        }

        break;
    }
  }

  async getObjects ({ request, response }) {
    const data = request.post()

    switch (data.type) {
      case 'mysql':
        const connection = mysql.createConnection({
          host: data.host,
          user: data.username,
          password: data.password,
          port: data.port,
          database: ''
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
          const asyncGetDatabases = (connection) => {
            return new Promise((resolve, reject) => {
              connection.query('SHOW DATABASES;', (err, result) => {
                if (err) reject(err)
                resolve(result)
              })
            })
          }

          const asyncGetTables = (connection, database) => {
            return new Promise((resolve, reject) => {
              connection.changeUser({
                database
              }, (err) => {
                reject(err)
              })
              connection.query(`SHOW TABLES;`, (err, result) => {
                if (err) reject (err)
                resolve(result)
              })
            })
          }

          const objects = (await asyncGetDatabases(connection)).map((database, index) => {
            const _database = {
              id: index,
              name: database['Database'],
              type: 'database'
            }
            return _database
          })

          const getData = () => {
            return Promise.all(objects.map(async (database) => {
              return asyncGetTables(connection, database.name)
            }))
          }

          return objects
        }
        break
    }
  }
}

module.exports = ConnectionController
