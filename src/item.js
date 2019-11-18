import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {render} from 'react-dom';
import {
	CardDragHandle, 
	Button, 
	ModalConfirm,
	TextInput } from '@contentful/forma-36-react-components';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';
import { SortableHandle} from 'react-sortable-hoc';

const DragHandle = SortableHandle(() => {
	return(
		<div className="CardDragHandle__CardDragHandle___2rqnO">
			<svg data-test-id="cf-ui-icon" 
				className="Icon__Icon___38Epv Icon__Icon--small___1yGZK Icon__Icon--muted___3egnD" 
				xmlns="http://www.w3.org/2000/svg" 
				width="24" 
				height="24" 
				viewBox="0 0 24 24"
			>
				<path 
					fill="none" 
					d="M0 0h24v24H0V0z">
				</path>
				<path 
					d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z">
				</path>
			</svg>
		</div>
	)
});

export default class Item extends Component {
	constructor(props){
		super(props)
		this.state={edit:false}
		
	}
	handleRemoveItem=()=>{

	  	console.log('remove')
  	}
  	handleClick=()=>{
	  	console.log('edit')	  	
  	}

	render(){
		return(
			<div className="Item">
			<DragHandle/>
			<div>
				<h3>{this.props.item.headline}</h3>
				<p>{this.props.item.content}</p>
			</div>
			<div className="buttonArea">
				<button 
					onClick={this.handleClick}
					className="editButton"
					id={this.props.item.id+"_button"}
					
				/>
				<button 	
					className="removeButton"
					onClick={this.handleRemoveItem}
				/>

			</div>
		</div>

		)
	}
	
}