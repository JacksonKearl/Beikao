import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import Fuse from 'fuse.js';
import Transition from 'react-transition-group/CSSTransitionGroup';

class Header extends Component {

	constructor(){
		super();
		this.state = {
			focused: false
		};
	}

	componentDidMount(){
		this.refs.inp.focus();
		this.setFocused(true);
	}

	setFocused(value){
		this.setState({
			focused: value
		});
	}

	render(){
		return (
			<div className='headerContainer'>
				<form className={this.state.focused ? 'headerForm headerFormFocus' : 'headerForm'}>
					<img src='search.svg' className='headerForm'/>
					<input
						ref='inp'
						type='text'
						className={this.state.focused ? 'headerInput headerInputFocus' : 'headerInput' }
						placeholder='search for something'
						value={this.props.text}
						onFocus={this.setFocused.bind(this, true)}
						onBlur={this.setFocused.bind(this, false)}
						onChange={(event) => this.props.updateText(event.target.value)}
					/>
				</form>
				<img src='add.svg' onClick={this.props.onPlusClick} className='plus'/>
			</div>
		);
	}
}

class Body extends Component {

	constructor(){
		super();
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
		let fuse = new Fuse(this.props.data, this.options);
		let result = this.props.text == '' ? this.props.data : fuse.search(this.props.text);
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

	exit(){
		const title = this.refs.title.value;
		const description = this.refs.desc.value;
		const tags = this.refs.tags.value;
		const oldTitle = this.props.title;
		this.props.updateCard(oldTitle, {title, description, tags});
		this.props.closeModal();
	}

	render(){
		return (
			<div
				className={this.props.visible ? 'modal show' : 'modal'}
			>
				<div className='modalTop modalRow'>
					<textarea className='modalTitle' defaultValue={this.props.title} ref='title' autoFocus={true}/>
				</div>
				<div className='modalMiddle modalRow'>
					<textarea className='modalDescription' defaultValue={this.props.description} ref='desc'/>
				</div>
				<div className='modalBottom modalRow'>
					<textarea className='modalTags' defaultValue={this.props.tags} ref='tags'/>
				</div>
				<div className='modalDone'>
					<div className='modalExit save' onClick={this.exit.bind(this)}>
						SAVE
					</div>
					<div className='modalExit cancel' onClick={this.props.closeModal}>
						CANCEL
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
			modalVisible: false,
			data: [],
		};
	}

	componentDidMount(){
		let data = JSON.parse(localStorage.getItem('beikao_data'));
		if(data != null){
			this.setState({ data });
		} else {
			this.setState({ data: [] });
		}
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

	updateCard(oldTitle, newData){
		if(newData.title == '') return;
		let data = this.state.data;
		const hasNewTitle = _.find(data, (o) => o.title == newData.title);
		if(oldTitle == '' && hasNewTitle) return;
		if(oldTitle != newData.title && hasNewTitle) return;
		const index = _.findIndex(data, (o) => o.title == oldTitle);
		if(index > -1){
			data[index] = newData;
		} else {
			data.push(newData);
		}
		this.setState({
			data
		});
		localStorage.setItem('beikao_data', JSON.stringify(data));
	}

	renderModal(){
		return (
			<Modal
				title={this.state.modalTitle}
				description={this.state.modalDescription}
				tags={this.state.modalTags}
				visible={this.state.modalVisible}
				closeModal={this.closeModal.bind(this)}
				updateCard={(title, newData) => this.updateCard(title, newData)}
			/>
		);
	}

	render(){
		return (
			<div>
				<Header
					text={this.state.text}
					updateText={(text) => this.setState({text})}
					onPlusClick={this.setModal.bind(this, '', '', '')}
				/>
				<Body
					text={this.state.text}
					onCardClick={(title, description, tags) => this.setModal.bind(this, title, description, tags)}
					data={this.state.data}
				/>
				<Transition
					transitionName='bounce'
					transitionEnterTimeout={500}
					transitionLeaveTimeout={300}
				>
					{this.state.modalVisible && this.renderModal()}
				</Transition>
			</div>
		);
	}
}

const app = document.getElementById('app');
ReactDOM.render(<App/>, app);
