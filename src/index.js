import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import Fuse from 'fuse.js';
import Transition from 'react-transition-group/CSSTransitionGroup';
import marked from 'marked';

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
				<img src='icons/delete_white.svg' onClick={this.props.deleteAll} className='plus'/>
				<form className={this.state.focused ? 'headerForm headerFormFocus' : 'headerForm'}>
					<img src='icons/search.svg' className='headerForm'/>
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
				<img src='icons/add.svg' onClick={this.props.onPlusClick} className='plus'/>
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
		return result.slice(0, 20).map((card) => {
			if(_.includes(result, card)){
				return (
					<div key={card.title} className='cardContainer' onClick={this.props.onCardClick(card.title, card.description, card.tags)}>
						<div className='cardTop'>
							<div className='cardTitle'>
								{card.title}
							</div>
						</div>
						<div className='cardMiddle'>
							<div
								className='cardDescription limitLines'
								dangerouslySetInnerHTML={{__html: marked(card.description)}}
							>
							</div>
						</div>
						<div className='cardBottom'>
							<div className='cardTags'>
								{card.tags.trim().split(/\s+/).map((tag) => {
									return (
										<div className='tag_card'>
											{tag}
										</div>
									);
								})}
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

	constructor({editing}){
		super();
		this.state = {
			editing
		};
	}

	handleEdit(){
		if(this.state.editing){
			const title = this.refs.title.value;
			const description = this.refs.desc.value;
			const tags = this.refs.tags.value;
			const oldTitle = this.props.title;
			this.props.updateCard(oldTitle, {title, description, tags});
			this.props.closeModal();
		}
		this.setState({editing: !this.state.editing});
	}

	getTitle(){
		if(this.state.editing){
			return (
				<div className='modalTop modalRow'>
					<textarea
						className='modalTitle'
						defaultValue={this.props.title}
						ref='title'
						autoFocus={true}
						placeholder='enter a title'
					/>
				</div>
			);
		} else {
			return (
				<div className='modalTop modalRow'>
					{this.props.title}
				</div>
			);
		}
	}

	getDescription(){
		if(!this.state.editing){
			const content = marked(this.props.description);
			return (
				<div className='modalMiddle modalRow' dangerouslySetInnerHTML={{__html: content}}/>
			);
		} else {
			return (
				<div className='modalMiddle modalRow'>
					<textarea
						className='modalDescription'
						defaultValue={this.props.description}
						ref='desc'
						autoFocus={true}
						placeholder='enter a description'
					/>
				</div>
			);
		}
	}

	getTags(){
		if(this.state.editing){
			return (
				<div className='modalBottom modalRow'>
					<textarea
						className='modalTags'
						defaultValue={this.props.tags}
						ref='tags'
						placeholder='enter some tags'
					/>
				</div>
			);
		} else {
			return (
				<div className='modalBottom modalRow'>
					{this.props.tags.trim().split(/\s+/).map((tag) => {
						return (
							<div className='tag_modal'>
								{tag}
							</div>
						);
					})}
				</div>
			);
		}
	}

	getModalButtons(){
		return (
			<div className='modalDone'>
				<div className='modalExit cancel' onClick={() => this.props.delete(this.props.title)}>
					<img src='icons/delete.svg'/>
				</div>
				<div className='modalExit cancel' onClick={this.handleEdit.bind(this)}>
					<img
						src={this.state.editing ? 'icons/save.svg' : 'icons/edit.svg'}
					/>
				</div>
				<div className='modalExit cancel' onClick={this.props.closeModal}>
					<img src='icons/cancel.svg'/>
				</div>
			</div>
		);
	}

	render(){
		return (
			<div className='modalContainer'>
				<div className={this.state.editing ? 'modal modalEditing' : 'modal'}>
					{this.getTitle()}
					{this.getDescription()}
					{this.getTags()}
					{this.getModalButtons()}
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
			modalEditing: false,
			data: [],
		};
	}

	componentDidMount(){
		let data = JSON.parse(localStorage.getItem('beikao_data'));
		if(data != null){
			this.setState({ data });
		} else {
			this.setState({ data: [{"title":"Welcome","description":"### Beikao is a note taking app. It is used for referencing commonly referred to information.\n\nFor example, you might look up which Photoshop menu something is in, and end up clicking four google search links until you get your answer. You think you might need it later, and put it here with the intention of never googling the same thing again.","tags":"welcome start learn beikao how to"},{"title":"Beikao is fuzzy search","description":"### The search bar up top is extremely fuzzy.\nThat way, when you're trying to search for a card you made one year ago, you have the greatest chance of finding it, spelling errors included.","tags":"beikao so fuzzy amazing yes interesting"},{"title":"Beikao is tag based","description":"### Tags have the highest search weighting\nAs such, when you make a new card, dump as many words as you can possibly think of into your card's tags, so the future you will be able to find what you're looking for when you have hundreds of Beikao cards.","tags":"so amazing beikao what does it even mean I dont know but it sounds so cool wow"},{"title":"Beikao is markdown","description":"### Beikao supports markdown.\n#### So awesome I know. I'm the one that made this you don't need to tell me twice.\n- you\n- can\n- do\n- this\n\n##### or ~~this~~\n1. or\n2. this\n3. or *this* or **this**\n\n~~~~\nor a code block???\nyes, even a code block!!!\n\nthat's what this was for\nto begin with!!\n~~~~\n\n---\n\nOH | MY | GOSH\n-|-|-\n*A* | `TABLE` | **?????**\nYES | A | TABLE\n\n> blockquotes too.\n> less exciting, but still very exciting.","tags":"tags and titles do not support markdown"},{"title":"Beikao is localStorage","description":"### Beikao saves to your localStorage\nAs long as you're using the same computer and don't navigate to Beikao and open a console and type in 'delete localStorage', you should be fine!\n\nAlternate saving features coming soon.","tags":"tags are not lame"},{"title":"Beikao is not finished","description":"### It's not finished\nIt's really not finished. Don't get mad at me.","tags":"not finished mikey sucks"},{"title":"Beikao is not google keep","description":"### It's not!\nBeikao looks the same but is way faster and not slow like google keep. I'm gonna change the style later so cool it.","tags":"google keep is too slow really super slow not fast at all beikao is extremely fast"},{"title":"Feel free to submit a PR","description":"### Let's make this good\nPlease I need this","tags":"is mikey bad at coding submit pull request to find out"},{"title":"Don't use it on your phone","description":"### It's not for that\nPhones suck","tags":"phones suck"},{"title":"Example usage: git change commit","description":"#### If not pushed\n`git commit --amend`\n#### If pushed, but is most recent push\n~~~~\ngit commit --amend\ngit push --force\n~~~~\n#### If pushed, and not most recent push\n~~~~\ngit rebase -i HEAD~n # n is integer\n# replace pick with reword for wanted changes\n# type new commit messages\ngit push --force\n~~~~","tags":"git change commit amend"},{"title":"Example usage: get rid of whitespace in photoshop","description":"#### Image menu -> Trim","tags":"photoshop whitespace transparent pixels trim get rid of"}]
			});
		}
	}

	setModal(title, description, tags, editing){
		this.setState({
			modalVisible: true,
			modalTitle: title,
			modalDescription: description,
			modalTags: tags,
			modalEditing: editing,
		});
	}

	closeModal(){
		this.setState({
			modalVisible: false,
			modalTitle: '',
			modalDescription: '',
			modalTags: '',
			modalEditing: false,
		});
	}

	deleteAll(){
		this.setState({
			data: []
		});
		localStorage.setItem('beikao_data', JSON.stringify([]));
	}

	deleteCard(title){
		let data = this.state.data;
		_.remove(data, (obj) => {
			return obj.title == title
		});
		this.setState({
			data
		});
		localStorage.setItem('beikao_data', JSON.stringify(data));
		this.closeModal();
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
				editing={this.state.modalEditing}
				delete={this.deleteCard.bind(this)}
			/>
		);
	}

	render(){
		return (
			<div>
				<Header
					text={this.state.text}
					updateText={(text) => this.setState({text})}
					onPlusClick={this.setModal.bind(this, '', '', '', true)}
					deleteAll={this.deleteAll.bind(this)}
				/>
				<Body
					text={this.state.text}
					onCardClick={(title, description, tags) => this.setModal.bind(this, title, description, tags, false)}
					data={this.state.data}
				/>
				<Transition
					transitionName='bounce'
					transitionEnterTimeout={500}
					transitionLeaveTimeout={500}
				>
					{this.state.modalVisible && this.renderModal()}
				</Transition>
				{this.state.modalVisible && <div className='overlay'/>}
			</div>
		);
	}
}

const app = document.getElementById('app');
ReactDOM.render(<App/>, app);
