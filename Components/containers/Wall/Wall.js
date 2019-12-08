import React from 'react';
// import './Wall.css';
import classnames from 'classnames';
import WallUserCover from "../WallUserCover/WallUserCover";
import Aux from '../../../Server.Client/client/src/hoc/Aux';

class Wall extends React.Component {
    state = { modalActive: false };

    modalActive = () => {this.setState({modalActive: true})};
    modalNotActive = () => {this.setState({modalActive: false})};

    render () {
        return (
            <Aux>
                <div className={classnames('Layout', this.state.modalActive ? 'BlurBackground' : null)}>
                    <WallUserCover  modalActive={this.modalActive}
                                    modalNotActive={this.modalNotActive}/>
                </div>
            </Aux>
        );
    }
}

export default Wall;
