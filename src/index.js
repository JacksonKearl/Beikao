import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class App extends Component {

	constructor(){
		super();
	}

	componentDidMount(){
		console.log('Component mounted');
	}

	render(){
		return (
			<div>
				heyo!
			</div>
		);
	}
}

const app = document.getElementById('app');
ReactDOM.render(<App/>, app);
