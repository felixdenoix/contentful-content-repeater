import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {render} from 'react-dom';
import { init } from 'contentful-ui-extensions-sdk';
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import update from 'immutability-helper';
import arrayMove from 'array-move';
import {
	CardDragHandle,
	EntryCard, 
	Button, 
	ModalConfirm,
	Form,
	TextInput,
	Textarea,
	Icon } from '@contentful/forma-36-react-components';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css'; 


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
				<button onClick={()=>props.onChildEdit(props)}
				type="button"
					className="editButton">
					<Icon icon="Edit"/>

				</button>
					
			    <button onClick={()=>props.onChildRemove(props)}
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
			    	child={item}
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
		this.state = {
			modal:{shown:false},
			target:null}
			
	}
	
	componentWillMount(){
	  this.props.sdk.window.updateHeight();
	  this.props.sdk.window.startAutoResizer();
	  this.setState(this.props.sdk.field.getValue())
	  this.setState({
		  	modal:{shown:false},
		  	target:null,
		  	fieldChange:null})
	  
	}
	componentDidMount(){
		

	}
	onSortEnd = ({oldIndex, newIndex}) => {	  
		this.setState(({items}) => ({
	      items: arrayMove(items, oldIndex, newIndex),
	    }))
		this.props.sdk.field.setValue(this.state);
	};
  
  	handleAddItem=()=>{
		const {items} = this.state;//destructure, pull items object out

		const newId = 'item-'+[...Array(5)].map(_=>(Math.random()*36|0).toString(36)).join('');
		const newObj = {"id":newId	,"content":"","headline":"..."}
		const AddState = [...items, newObj]//add new item to items object
		this.setState({items:AddState},this.handleEditModal({id:newObj.id, childIndex:(items.length), child:newObj}));
		
		//open edit modal right away
  	}
  	handleEdit=(props)=>{
//console.log(props)
	  	const {fieldChange,items} = {...this.state}
	  	//console.log('field ',fieldChange)
	  	const target  = items[props.index]
	  	//console.log('target: ',target)
	  	if(fieldChange.headline !== undefined)target.headline = fieldChange.headline;
	  	if(fieldChange.content!==undefined)target.content = fieldChange.content;
  		const updateTarget = update(this.state,{
	  		modal:{
		  		shown:{$set:false},
		  		},
	  		fieldChange:{$set:null},
		  	target:{$set:null},
	  		items:{[props.index]:{$set:target}}
		  		
	  		})
  		//console.log('updated ',updateTarget)
  		this.setState(updateTarget,()=>{console.log(this.state)})

  		

	}
	
	handleEditModal=(props)=>{
	  	this.setState({
		  	modal:{
			  	shown:true,
			  	type:'edit',
			  	title: "Edit Entry",
			  	intent:"primary",
			  	confirm:"Change Entry",
			  	
			  	},
			target:{
				index:props.childIndex,
				id:props.id,
				content:props.child
			}
			
		  	})
	}
	handleFieldChange(event){
		var updates = {...this.state.fieldChange}
		updates[event.target.name]=event.target.value;
		this.setState({fieldChange:updates})
	}
	
  	handleRemoveModal=(props)=>{
	  	this.setState({
		  	modal:{
			  	shown:true,
			  	type:'delete',
			  	title: "Confirm Entry Removal",
			  	intent:"negative",
			  	confirm:"Confirm Entry Removal",
			  	}, 
		  	target:{
			  	index:props.childIndex,
			  	id:props.id,
			  	content:null
			  	}
			
		  	})
	}	
  	handleRemove=(props)=>{
	  	const removal = update(this.state,{
		  	modal:{
		  		shown:{$set:false},
		  		},
	  		fieldChange:{$set:null},
		  	target:{$set:null},
	  		items:{$splice:[[props.index,1]]}
		  		
	  		} )
	  		this.setState(removal,()=>{this.props.sdk.field.setValue(this.state)})
	  	//this.setState({...this.state,items: this.state.items.filter((item,index)=> props.index!==index)},()=>{this.props.sdk.field.setValue}); 
	  	 	
  	}
  	
  	onConfirm(props){
	  	if(this.state.modal.type==="delete"){
		  	this.handleRemove(props)
	  	}else{
		  	this.handleEdit(props)
	  	}
	  	this.setState({
		  	modal:{shown:false},
		  	target:null,
		  	fieldChange:null})
		 this.props.sdk.field.setValue(this.state)
  	}
  	//add alloy inline to textarea
  	renderSwitch(param) {
	  switch(param) {
	    case 'edit':
	  		return(
		  		<Form onSubmit={this.onHandleEdit}>
			  		<TextInput 
			  		name="headline" 
			  		id="headline" 
			  		value={this.state.target.content.headline||''}
			  		onChange={(e)=>this.handleFieldChange(e)}
			  		/>
			  		
			  		<Textarea 
			  		name="content" 
			  		id="content" 
			  		rows={6}
			  		 value={this.state.target.content.content||''}
			  		onChange={(e)=>this.handleFieldChange(e)}/>
		  		</Form>
		  		)
		break;
		case 'delete':
			return 'You are about to delete this entry.'
		break;
		default:
		break;	  
		}
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
		        size="large"
		        title={this.state.modal.title||"Modal"}
		        intent={this.state.modal.intent||"positive"}
		        confirmLabel={this.state.modal.confirm||"Confirm"}
		        cancelLabel="Cancel" 										
		        onCancel={() => this.setState({modal:{shown:false},target:null,fieldChange:null})}
		        onConfirm={() => {	
					this.onConfirm(this.state.target)
		        }}
		      >
      	        {this.renderSwitch(this.state.modal.type)}
      	        {this.props.children}
	      </ModalConfirm>
		 
	      </>
		);
	  }
}

class ConfirmModal extends ModalConfirm{
	
	constructor(props){
		super(props)
		
	}
}
init(sdk => {render(<App sdk={sdk} />, document.getElementById('root'));});
