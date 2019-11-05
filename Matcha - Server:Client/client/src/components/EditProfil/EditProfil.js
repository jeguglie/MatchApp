import React from 'react';
import {
    Button,
    Form,
    Divider,
    TextArea,
    Grid,
    Progress,
    Image,
    Icon
} from 'semantic-ui-react';
import API from "../../utils/API";
import classnames from 'classnames';
import DividerC from "../Divider/Divider";

const ProgressBar = () => (
    <Progress percent={60}
              className="ProgressBarProfile"
              progress
              size="large"/>
);
const DEFAULT_STATE = {
        email: "",
        firstName: "",
        lastName: "",
        interested: "",
        bio: "",
        gender: "",
        interests: [],
        country: "",
        birthday: "",
        messages : {
            save: false,
            warnings: []
        }
};
class EditProfil extends React.Component {

    constructor(props) {
        super(props);
        this.state = {...DEFAULT_STATE};
    }

    async componentDidMount() {
        try {
                const {data} = await API.getEditProfilValues(localStorage.getItem('id'));
                if (data && data.message === true)
                    this.setState({warnings: data.message});
                const newState = data.findProfil;
                if (data.findProfil) {
                    this.setState({...newState});
                }
        } catch (error) {
            console.error(error);
        }
    }
    handleSave = async() => {
        try {
            const data = await API.updateEditProfilValues(this.state, localStorage.getItem('id'));
            if (Array.isArray(data.warnings) && data.warnings.length)
                this.setState({warnings: data.warnings});
            else
                this.setState({save: true});
        } catch (error) {
            console.error(error);
        }
    };

    handleChange = async(event) => {
        console.log(event.target.value);
        this.setState({[event.target.id]: event.target.value})
    };

    render() {
        return (
            <div className={classnames("ui middle", "EditProfil")}>
                <Grid columns={2} doubling>
                    <Grid.Column>
                        <h1 className="CompleteTitle">Complete Your Profile</h1>
                    </Grid.Column>
                    <Grid.Column>
                        <ProgressBar/>
                    </Grid.Column>
                </Grid>
                <DividerC />
                <Divider/>
                <DividerC />
                <Grid textAlign="center">
                    <Grid.Row>
                        <Image centered
                               src='https://react.semantic-ui.com/images/wireframe/white-image.png'
                               size='medium'
                               circular bordered/>
                    </Grid.Row>
                    <Grid.Row className="EditProfilIcons">
                        <Icon size='big' circular inverted name='facebook'/>
                        <Icon size='big' circular inverted name='instagram'/>
                        <Icon size='big' circular inverted name='upload'/>
                    </Grid.Row>
                </Grid>
                <DividerC />
                <Divider/>
                <DividerC />
                <Grid columns={1} doubling>
                    <Grid.Column>
                        <Form  className="formEdit">
                            <Form.Group widths='equal'>
                                <Form.Input fluid
                                            label='Last Name'
                                            color="white"
                                            id="lastName"
                                            value={this.state.lastName}
                                            onChange={this.handleChange}
                                />
                                <Form.Input fluid
                                            label='First Name'
                                            id="firstName"
                                            value={this.state.firstName}
                                            onChange={this.handleChange}
                                />
                            </Form.Group>
                            <Form.Group widths='equal'>
                                {/*<Form.Select*/}
                                {/*    fluid*/}
                                {/*    label='Gender'*/}
                                {/*    id="gender"*/}
                                {/*/>*/}
                                {/*<Form.Select*/}
                                {/*    fluid*/}
                                {/*    label='Country'*/}
                                {/*    id="country"*/}
                                {/*/>*/}
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Input
                                    fluid
                                    label='Email'
                                    id="email"
                                    value={this.state.email}
                                    onChange={this.handleChange}
                                />
                                {/*<Form.Select fluid*/}
                                {/*             label='Interested By'*/}
                                {/*             color="white"*/}
                                {/*             id="interested"*/}
                                {/*/>*/}
                            </Form.Group>
                            <Form.Field
                                label='Bio'
                                control={TextArea}
                                id="bio"
                                value={this.state.bio}
                                onChange={this.handleChange}
                            />
                        </Form>
                    </Grid.Column>
                    <Grid.Row centered>
                        {/*<Input*/}
                        {/*    icon='tags'*/}
                        {/*    iconPosition='left'*/}
                        {/*    label={{tag: true, content: 'Add Tag'}}*/}
                        {/*    labelPosition='right'*/}
                        {/*    placeholder='Enter tags'*/}
                        {/*/>*/}
                    </Grid.Row>
                    <Grid.Row centered>
                        <Button className="loginButton" size="big" onClick={this.handleSave}>Submit</Button>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}
export default EditProfil;