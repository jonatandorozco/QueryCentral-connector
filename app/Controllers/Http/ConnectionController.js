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

    // return {
    //   version: '0.1.0'
    // }
  }
}

module.exports = ConnectionController
