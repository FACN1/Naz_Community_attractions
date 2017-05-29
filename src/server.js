const express = require('express')
const hbs = require('express-handlebars')
const path = require('path')
const bodyParser = require('body-parser')
const db = require('./db_queries.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const dateFormat = require('dateformat')
const cookieParser = require('cookie-parser')
const { formatEvents } = require('./helpers.js')

require('env2')('./config.env')
const server = express()

server.use(express.static(path.join(__dirname, '../public')))
server.use(bodyParser.urlencoded({
  extended: true
}))
server.use(cookieParser())

// auth middleware
server.use((req, res, next) => {
  if (req.cookies.token) {
    jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        // token is not valid
        return next()
      }
      // add to the request
      req.isAuthenticated = true
      req.username = decoded.username
      next()
    })
  } else {
    next()
  }
})

server.engine('hbs', hbs({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: {
    formatDate: (date) => dateFormat(date, 'dddd d mmmm, yyyy')
  }
}))

server.set('view engine', 'hbs')

server.get('/', function (req, res) {
  db.getEvents((err, events) => {
    if (err) {
      // to be improved
      return res.send('db error :(')
    }
    res.render('home', {
      datesWithEvents: formatEvents(events)
    })
  })
})

server.get('/events/:id', (req, res) => {
  db.getEventById(req.params.id, (err, event) => {
    if (err) {
      return res.send('db error :(')
    }
    res.render('event_detail', event)
  })
})

server.get('/event-form', (req, res) => {
  if (req.isAuthenticated) {
    return res.render('event-form', { username: req.username })
  }
  res.redirect('/organisations/login')
})

server.get('/organisations/login', (req, res) => {
  res.render('organisations_login')
})

server.post('/authenticate', (req, res) => {
  const { username, password } = req.body
  db.getOrganizerByUsername(username, (err, organizer) => {
    if (err) {
      // to be improved
      return res.send(err.message)
    }
    if (!organizer) {
      // not ideal as it retains the /authenticate route in url
      return res.render('organisations_login', {
        errorMessage: 'username not recognised.'
      })
    } else {
      bcrypt.compare(password, organizer.password, (err, isCorrect) => {
        if (err) {
          // to be improved
          return res.send(err.message)
        }
        if (!isCorrect) {
          return res.render('organisations_login', {
            errorMessage: 'incorrect password.'
          })
        }
        const token = jwt.sign({username}, process.env.JWT_SECRET)
        // set a cookie which is secure in production
        res.cookie('token', token, {
          secure: process.env.NODE_ENV === 'production',
          sameSite: true
        })
        // should ideally redirect to profile page or create event page.
        res.send('correct credentials')
      })
    }
  })
})

module.exports = server
