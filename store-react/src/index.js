import React from 'react'
import ReactDOM from 'react-dom'
import 'typeface-roboto'
import '@devexpress/dx-react-grid/dist/dx-react-grid.es'
import './index.css'
import 'bootstrap/dist/css/bootstrap-theme.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap.css.map'
import MainRouter from './MainRouter.js'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(<MainRouter/>, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
