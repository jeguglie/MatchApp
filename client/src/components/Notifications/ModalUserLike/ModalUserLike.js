import React from 'react';
import API from './../../../utils/API';
import {Divider, Grid, Image, Label, Modal, Segment} from "semantic-ui-react";

class ModalUserLike extends React.Component {

    state = {
        userID: null,
        showModal: false,
        user: null,

    };

    handleClose = () => {
        this.setState({ userID: null, showModal: false, user: null});
        this.props.handleClose();
    }

   componentDidUpdate = async(props, state) =>{
        if (props.userID !== state.userID)
            await API.withAuth()
               .then(res => {
                   if (res.status === 200) {
                       API.getUserIdProfile(props.userID)
                           .then(res => {
                               if (res.status === 200)
                                   this.setState({user: res.data.user, showModal: true, userID: props.userID});
                           });
                   }
               })
                .catch(err => {})
        return null;
    }

    render(){
        const { userID, showModal , user} = this.state;
        if (user)
            return (
                <Modal
                    dimmer={"blurring"}
                    size={'tiny'}
                    open={showModal}
                    onClose={this.handleClose}
                    className="ModalUserLike">
                    <Modal.Header className="CardHeader"><h1
                        className="CardHeaderTile"> {user.firstname} {user.lastname}, <strong>{user.age}</strong></h1>
                    </Modal.Header>
                    <Modal.Content className="ModalProfilView">
                        <Modal.Header></Modal.Header>
                        <Divider hidden/>
                        <Grid centered columns={2}>
                            <Grid.Column className="RowImages">
                                <Image rounded size='medium' src={user.imgs[0]}/>
                            </Grid.Column>
                            <Grid.Row className="RowImages" centered columns={user.imgs.length}>
                                {user.imgs.map((img, i) => {
                                    if (i > 0)
                                        return (
                                            <Grid.Column>
                                                <Image rounded size='small' src={user.imgs[i]}/>
                                            </Grid.Column>
                                        )
                                })}
                            </Grid.Row>
                        </Grid>
                    </Modal.Content>
                </Modal>
            )
        return null;
    }
}

export default ModalUserLike;