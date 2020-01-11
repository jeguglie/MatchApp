import {Divider, Grid, Image, Label, Modal, Segment} from "semantic-ui-react";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import React from "react";
import classnames from 'classnames';
import API from './../../utils/API';
import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:3002');

class ModalUser extends React.Component {

    constructor(props){
        super(props);
    }
    userLike = async() => {
        socket.emit("like", this.props.user.user_id);
}


    render() {
        const {user, userInterests } = this.props;
        return (
            <Modal
                dimmer={"blurring"}
                size={'tiny'}
                open={this.props.showModal}
                onClose={this.props.handleClose}
                className="ModalCard">
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
                    <Modal.Description>
                        <Segment className="BioSegment" textAlign="center" inverted>
                            <p>{user.bio}</p>
                        </Segment>
                        <Segment className="CardUserActions" basic textAlign="center">
                            <Button.Group>
                                <Button
                                    size='huge'
                                    id="like"
                                    onClick={this.userLike}>Like</Button>
                                <Button.Or text='or'/>
                                <Button size='huge' id="hide" positive>Hide</Button>
                            </Button.Group>
                        </Segment>
                        <Divider hidden/>
                        <Label.Group size='small'>
                            <p/>
                            {user.interests.map((data, i) => {
                                return (
                                    <Label
                                        className={userInterests.find(interest => interest === data) ? classnames("interestLabel","sameInterest") : "interestLabel"}
                                        id={i}
                                        key={i}
                                        data={data}>
                                        <strong>#</strong>{data}</Label>
                                )
                            })}
                        </Label.Group>
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        )
    }
}

export default ModalUser;