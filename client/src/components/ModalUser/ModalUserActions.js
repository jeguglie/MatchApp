import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import API from 'Src/utils/API';
import { store } from 'react-notifications-component';

class ModalUserActions extends React.Component{

    constructor(props){
        super(props);
        this._mounted = false;
    }

    componentDidMount() {
        this._mounted = true;
    }
    doReport = async() => {
        await API.reportuser(this.props.userID)
            .then(response => {
                if (response.status === 200){
                    store.addNotification({
                        title: 'Report',
                        message: 'User has been reported',
                        type: "warning",
                        insert: "top",
                        container: "top-right",
                        animationIn: ["animated", "fadeIn"],
                        animationOut: ["animated", "fadeOut"],
                        dismiss: {
                            duration: 10000,
                            onScreen: true
                        }
                    });
                }
            })
            .catch (err => { console.log(err)});
        this.props.closeReport();
    };
    doFake = async() => {
        await API.reportuserfake(this.props.userID)
            .then(response => {
                if (response.status === 200){
                    store.addNotification({
                        title: 'Report as fake',
                        message: 'User has been reported as a fake',
                        type: "warning",
                        insert: "top",
                        container: "top-right",
                        animationIn: ["animated", "fadeIn"],
                        animationOut: ["animated", "fadeOut"],
                        dismiss: {
                            duration: 10000,
                            onScreen: true
                        }
                    });
                }
            })
            .catch (err => { console.log(err)});
        this.props.closeFake();
    };
    doHide = async() => {
        await API.reportuserhide(this.props.userID)
            .then(response => {
                if (response.status === 200){
                    store.addNotification({
                        title: 'Hide user',
                        message: 'User has been successfully hided for next time',
                        type: "warning",
                        insert: "top",
                        container: "top-right",
                        animationIn: ["animated", "fadeIn"],
                        animationOut: ["animated", "fadeOut"],
                        dismiss: {
                            duration: 10000,
                            onScreen: true
                        }
                    });
                }
            })
            .catch (err => { console.log(err)});
        this.props.closeHide();
    };
    render(){
        return (
            <div>
                {/*REPORT USER*/}
                <Modal size='tiny' open={this.props.openReport} onClose={this.props.closeReport}>
                    <Modal.Header>Report user</Modal.Header>
                    <Modal.Content>
                        <p>Are you sure you want to report this user ?</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button
                            negative
                            onClick={this.props.closeReport}>
                            No
                        </Button>
                        <Button
                            positive
                            icon='checkmark'
                            labelPosition='right'
                            content='Yes'
                            onClick={this.doReport}
                        />
                    </Modal.Actions>
                </Modal>
                {/* REPORT FAKE USER */}
                <Modal size='tiny' open={this.props.openFake} onClose={this.props.closeFake}>
                    <Modal.Header>Report user as a fake</Modal.Header>
                    <Modal.Content>
                        <p>Are you sure you want to report this user as a fake?</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button
                            negative
                            onClick={this.props.closeFake}>
                            No
                        </Button>
                        <Button
                            positive
                            icon='checkmark'
                            labelPosition='right'
                            content='Yes'
                            onClick={this.doFake}
                        />
                    </Modal.Actions>
                </Modal>
                {/* REPORT HIDE USER */}
                <Modal size='tiny' open={this.props.openHide} onClose={this.props.closeHide}>
                    <Modal.Header>Hide next time</Modal.Header>
                    <Modal.Content>
                        <p>Are you sure you want to hide this user the next time?</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button
                            negative
                            onClick={this.props.closeHide}>
                            No
                        </Button>
                        <Button
                            positive
                            icon='checkmark'
                            labelPosition='right'
                            content='Yes'
                            onClick={this.doHide}
                        />
                    </Modal.Actions>
                </Modal>
            </div>
        )
    }
}

export default ModalUserActions;