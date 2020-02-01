import {Divider, Grid, Image, Label, Modal, Segment, Icon} from "semantic-ui-react";
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import React from "react";
import classnames from 'classnames';
import ModalUserActions from "./ModalUserActions";

const DEFAULT_STATE = {
    openHide: false,
    openReport: false,
    openFake: false,
};

class ModalUser extends React.Component {

    constructor(props){
        super(props);
        this.state = {...DEFAULT_STATE};
        this._mounted = false;
    }

    componentDidMount = async() => {
        this._mounted = true;
    };
    componentWillUnmount() {
        this._mounted && this.setState({...DEFAULT_STATE});
        this._mounted = false;
    }
    // Modal user actions
    closeReport = () => { this._mounted && this.setState({openReport: false})};
    openReport = () => {this._mounted && this.setState({openReport: true})};
    closeFake = () => { this._mounted && this.setState({openFake: false})};
    openFake = () => {this._mounted && this.setState({openFake: true})};
    closeHide = () => { this._mounted && this.setState({openHide: false})};
    openHide = () => {this._mounted && this.setState({openHide: true})};
    render() {
        const {user, userInterests, liked } = this.props;
        return (
            <div>
                <ModalUserActions
                    openReport={this.state.openReport}
                    closeReport={this.closeReport}
                    openFake={this.state.openFake}
                    closeFake={this.closeFake}
                    openHide={this.state.openHide}
                    closeHide={this.closeHide}
                    userID={this.props.user.user_id}
                />
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
                            <Grid.Row className="RowImages" centered columns={4}>
                                {user.imgs.map((img, i) => {
                                    if (i > 0)
                                        return (
                                            <Grid.Column key={i}>
                                                <Image rounded size='small' src={user.imgs[i]}/>
                                            </Grid.Column>
                                        );
                                    return null;
                                })}
                            </Grid.Row>
                        </Grid>
                        <Modal.Description>
                            <Segment className="BioSegment" textAlign="center" inverted>
                                <p>{user.bio}</p>
                            </Segment>
                            <Segment basic textAlign={'center'}>
                                <Button size='small' id='like' onClick={() => this.props.userLike(user.user_id)}>
                                    <Icon name='heart'/>
                                    {liked ? 'Unlike' : 'Like'}
                                </Button>
                                <Button size='small' id='hide' onClick={this.openHide}>
                                    <Icon name='user x'/>
                                    Hide
                                </Button>
                                <Button size='small' id='fake' onClick={this.openFake}>
                                    <Icon name='user secret'/>
                                    Fake
                                </Button>
                                <Button size='small' id='blockuser' onClick={this.openReport}>
                                    <Icon name='warning'/>
                                    Signal
                                </Button>
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
            </div>
        )
    }
}

export default ModalUser;