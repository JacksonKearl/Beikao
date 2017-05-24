import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import Fuse from 'fuse.js';

class Header extends Component {

	constructor(){
		super();
	}

	componentDidMount(){
		console.log('Component mounted');
	}

	render(){
		return (
			<div className='headerContainer'>
				<input
					className='headerInput'
					placeholder='search for something'
					value={this.props.text}
					autoFocus={true}
					onChange={(event) => this.props.updateText(event.target.value)}
				/>
			</div>
		);
	}
}

class Body extends Component {

	constructor(){
		super();
		this.data = [
			{title: 'update git', tags: 'git amend', description: 'hello hello he444llo'},
			{title: 'update git1', tags: 'git commit', description: 'hello hello he444llo'},
			{title: 'update git2', tags: 'bash generate random string', description: 'hello hello he444llo'},
			{title: 'update git3', tags: 'thr', description: 'hello hello he444llo'},
			{title: 'update git4', tags: 'this', description: 'hello hello he444llo'},
			{title: 'update git5', tags: 'is', description: 'hello hello he444llo'},
			{title: 'update git6', tags: 'where', description: 'hello hello he444llo'},
			{title: 'update git7', tags: 'we', description: 'hello hello he444llo'},
			{title: 'update git8', tags: 'need', description: 'hello hello he444llo'},
			{title: 'update git9', tags: 'diff', description: 'hello hello he444llo'},
		];
		this.options = {
			keys: [{
					name: 'tags',
					weight: 0.65
				},{
					name: 'title',
					weight: 0.2
				},{
					name: 'description',
					weight: 0.15
				}],
			shouldSort: true,
			minMatchCharLength: 0,
		};
	}

	getCards(){

		let fuse = new Fuse(this.data, this.options);
		let result = this.props.text == '' ? this.data : fuse.search(this.props.text);
		console.log(result)
		return result.map((card) => {
			if(_.includes(result, card)){
				return (
					<div key={card.title} className='cardContainer'>
						<div className='cardTop'>
							<div className='cardTitle'>
								{card.title}
							</div>
							<div className='cardDescription'>
								{card.description}
							</div>
						</div>
						<div className='cardBottom'>
							{card.tags}
						</div>
					</div>
				);
			}
		})
	}

	render(){
		return (
			<div className='bodyContainer'>
				{this.getCards()}
			</div>
		);
	}
}

class App extends Component {

	constructor(){
		super();
		this.state = {
			text: ''
		};
	}

	render(){
		return (
			<div>
				<Header text={this.state.text} updateText={(text) => this.setState({text})}/>
				<Body text={this.state.text}/>
			</div>
		);
	}
}

const app = document.getElementById('app');
ReactDOM.render(<App/>, app);
