import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker, { unregister } from './registerServiceWorker'

String.prototype.replaceAll = function(search, replacement) {
	var target = this
	return target.replace(new RegExp(search, 'g'), replacement)
}

ReactDOM.render(<App />, document.getElementById('root'))
// registerServiceWorker()
unregister()
