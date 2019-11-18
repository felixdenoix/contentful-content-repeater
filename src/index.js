import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {render} from 'react-dom';
import { init } from 'contentful-ui-extensions-sdk';
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import {
	CardDragHandle,
	EntryCard, 
	Button, 
	ModalConfirm,
	TextInput,
	Icon } from '@contentful/forma-36-react-components';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css'; 

 //Add edit, add and remove ui and functions to mangage the list
 //edit: possible modal so to have RTE
 //truncate P content after xx numbver of words/characters
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

const SortableItem = SortableElement((props) => {
	return (

		<div className="Item" >
			<DragHandle/>
			<div>
				<h3>{props.value.headline}</h3>
				<p>{props.value.content}</p>
			</div>

			<div className="buttonArea">
				<button onClick={()=>props.onChildEdit(props.value)}
				type="button"
					className="editButton">
					<Icon icon="Edit"/>

				</button>
					
			    <button onClick={()=>props.onChildRemove(props.id,props.childIndex)}
			    	className="removeButton">
			    	<Icon icon="Close"/>
				</button>
			</div>				
		</div>

	)
});

const SortableList = SortableContainer((props) => {

	return (
		<div className="sortableList">
		  {props.items.map((item, index) => (
			    <SortableItem
			    	key={item.id} 	 
			    	index={index} 
			    	value={item} 
			    	onChildEdit={props.onEdit}
			    	onChildRemove={props.onRemove}
			    	id={item.id}
			    	childIndex={index}
			    	/>
			    )   	
		  )}
		  <Button 
		      buttonType="naked" 
		      isFullWidth={true} 
		      icon="Plus" 
		      id="add-new-item"
		      onClick={props.onAddItem}
			  />
	</div>
	);
});
 

export class App extends React.Component {
	static propTypes = {
		sdk: PropTypes.object.isRequired
	};
	
	constructor(props) {
		super(props);
		this.state = props.sdk.field.getValue();	
	}
	
	componentWillMount(){
	  this.props.sdk.window.updateHeight();
	  this.props.sdk.window.startAutoResizer();
	}
	
	onSortEnd = ({oldIndex, newIndex}) => {	  
		this.setState(({items}) => ({
	      items: arrayMove(items, oldIndex, newIndex),
	    }))
		this.props.sdk.field.setValue(this.state);
	};
  
  	handleAddItem=()=>{
		const {items} = this.state;
		const newId = 'item-'+[...Array(5)].map(_=>(Math.random()*36|0).toString(36)).join('');
		const AddState = [...items, {"id":newId	,"content":"","headline":"..."}]
		this.setState(({items})=>({items:AddState}));
  	}
  	handleEdit=(item)=>{
	  	
	  	console.log(item.id);
	  	return(
		  	<TextInput
		  	value={item.headline}
		  	/>
	  	)
  	}
  	handleRemoveModal=(itemId, itemIndex)=>{
	  	this.setState({modal:{confirm:"Delete Entry", shown:true, type:"delete"},remove:{id:itemId, index:itemIndex}})
	}	
  	handleRemove=(remitem)=>{
	  	const removed = this.state.items.filter((item,index)=> remitem.index!==index);
	  	this.setState({items:removed, remove:null});
  	}
  	render() {
	    return (
		    <>
		    <SortableList 
			    items={this.state.items} 
			    onSortEnd={this.onSortEnd} 
			    onAddItem={this.handleAddItem}
			    onEdit = {this.handleEditModal}
			    onRemove = {this.handleRemoveModal}
		    /> 
		    <ModalConfirm
		        isShown={this.state.modal.shown||false}
		        title="Confirm Entry Removal"
		        intent="negative"
		        confirmLabel={this.state.modal.confirm||"Confirm"}
		        cancelLabel="Cancel" 										
		        onCancel={() => this.setState({modal:{shown:false}})}
		        onConfirm={() => {
		         this.setState({modal:{shown:false}})	
		         this.handleRemove(this.state.remove)

		        }}
		      >
	        <p>You are about to delete SOMETHING.</p>
	      </ModalConfirm>
		 
	      </>
		);
	  }
}

init(sdk => {render(<App sdk={sdk} />, document.getElementById('root'));});
