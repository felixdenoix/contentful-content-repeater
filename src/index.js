import React from 'react';
import PropTypes from 'prop-types';
import {render} from 'react-dom';
import '@atlaskit/css-reset';
import { TextInput } from '@contentful/forma-36-react-components';
import { init } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import arrayMove from 'array-move';

const SortableItem = SortableElement(({value}) => <div className="Item"><h3>{value.headline}</h3><p>{value.content}</p></div>);

const SortableList = SortableContainer(({items}) => {
  return (
    <div>
      {items.map((item, index) => (
        <SortableItem key={item.id} index={index} value={item} />
      ))}
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
  componentDidMount(){
	  this.props.sdk.window.startAutoResizer();
  }
  onSortEnd = ({oldIndex, newIndex}) => {	  
    this.setState(({items}) => ({
      items: arrayMove(items, oldIndex, newIndex),
    }));
    this.props.sdk.field.setValue(this.state);
  };
 
  render() {
    return (
	    <div style={{height:800}}/>
    );
  }
}

init(sdk => {
	sdk.window.startAutoResizer();
	render(<App sdk={sdk} />, document.getElementById('root'));
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
