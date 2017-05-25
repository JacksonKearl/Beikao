import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import Fuse from 'fuse.js';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

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
			{title: 'update git', tags: 'git amend', description: 'hello hello he444llogit rebase -i HEAD~3 # Displays a list of the last 3 commits on the current branchgit rebase -i HEAD~3 # Displays a list of the last 3 commits on the current branchgit rebase -i HEAD~3 # Displays a list of the last 3 commits on the current branchgit rebase -i HEAD~3 # Displays a list of the last 3 commits on the current branchgit rebase -i HEAD~3 # Displays a list of the last 3 commits on the current branchgit rebase -i HEAD~3 # Displays a list of the last 3 commits on the current branch'},
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
		return result.map((card) => {
			if(_.includes(result, card)){
				return (
					<div key={card.title} className='cardContainer' onClick={this.props.onCardClick(card.title, card.description, card.tags)}>
						<div className='cardTop'>
							<div className='cardTitle'>
								{card.title}
							</div>
						</div>
						<div className='cardMiddle'>
							<div className='cardDescription limitLines'>
								{card.description.length > 200 ? card.description.substr(0, 200) + '...' : card.description}
							</div>
						</div>
						<div className='cardBottom'>
							<div className='cardTags'>
								{card.tags}
							</div>
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

class Modal extends Component {

	constructor(){
		super();
	}

	render(){
		return (
			<div
				className={this.props.visible ? 'modal show' : 'modal'}
				onClick={this.props.closeModal}
			>
				<div className='modalTop'>
					<div className='modalTitle'>
						{this.props.title}
					</div>
				</div>
				<div className='modalMiddle'>
					<div className='modalDescription'>
						{this.props.description}
					</div>
				</div>
				<div className='modalBottom'>
					<div className='modalTags'>
						{this.props.tags}
					</div>
				</div>
			</div>
		);
	}
}

class App extends Component {

	constructor(){
		super();
		this.state = {
			text: '',
			modalTitle: '',
			modalDescription: '',
			modalTags: '',
			modalVisible: false
		};
	}

	setModal(title, description, tags){
		this.setState({
			modalVisible: true,
			modalTitle: title,
			modalDescription: description,
			modalTags: tags
		});
	}

	closeModal(){
		this.setState({
			modalVisible: false,
			modalTitle: '',
			modalDescription: '',
			modalTags: ''
		});
	}

	renderModal(){
		if(this.state.modalVisible){
			return (
				<Modal
					title={this.state.modalTitle}
					description={this.state.modalDescription}
					tags={this.state.modalTags}
					visible={this.state.modalVisible}
					closeModal={this.closeModal.bind(this)}
				/>
			);
		}
	}

	render(){
		return (
			<div>
				<Header text={this.state.text} updateText={(text) => this.setState({text})}/>
				<Body
					text={this.state.text}
					onCardClick={(title, description, tags) => this.setModal.bind(this, title, description, tags)}
				/>
				<CSSTransitionGroup
					transitionName="example"
					transitionEnterTimeout={500}
					transitionLeaveTimeout={300}
				>
					{this.renderModal()}
				</CSSTransitionGroup>
			</div>
		);
	}
}

const app = document.getElementById('app');
ReactDOM.render(<App/>, app);
