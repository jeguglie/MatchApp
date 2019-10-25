import React from 'react';
import './App.css';
import classnames from 'classnames';
import WallUserCover from "./containers/WallUserCover/WallUserCover";
import MenuBar from "./components/UI/MenuBar/MenuBar";
import Aux from './hoc/Aux';

class App extends React.Component {

    state = {
        modalActive: false
    }
    modalActive = () => {this.setState({modalActive: true})};
    modalNotActive = () => {this.setState({modalActive: false})};

    render () {
        return (
            <Aux >
                <MenuBar />
                <div className={classnames('Layout', this.state.modalActive ? 'BlurBackground' : null)}>
                    <WallUserCover  modalActive={this.modalActive}
                                    modalNotActive={this.modalNotActive}/>
                </div>
            </Aux>
        );
    }
}

export default App;