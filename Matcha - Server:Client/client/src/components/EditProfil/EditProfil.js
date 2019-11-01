import React from 'react';
import {
    Button,
    Checkbox,
    Form,
    Input,
    Radio,
    Select,
    TextArea,
    Grid,
    Progress,
    Image,
    Icon
} from 'semantic-ui-react';
import API from "../../utils/API";
// import './EditProfil.css';

const ProgressBar = () => <Progress percent={60}
                                    className="ProgressBarProfile"
                                    progress
                                    size="large"/>

class EditProfil extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: localStorage.getItem('email'),
            birthday: "",
            firstName: "",
            lastName: "",
            gender: "",
            interested: "",
            bio: "",
            country: ""
        };
        this.messages = {
            save: false,
            warnings: []
        }
    }

    componentDidMount() {
        try {
                const { data } = API.getEditProfilValues(this.state.email);
                if (data && data.message === true)
                    this.setState({message: data.message});

            } catch (error) {
                console.error(error);
            }
        }
    handleSave = () => {
        const data = API.updateEditProfilValues(this.state);
        if (data && data.warnings[0])
            this.state.setState({warnings: data.warnings});
        else
            this.messages.setState({save: true});
    };

    handleChange = (event) => {
        this.state.setState({[event.target.id]: event.target.value})
    };

    render() {
        return (
            <div className="ui middle EditProfil">
                <Grid columns={2} doubling>
                    <Grid.Column>
                        <h1 className="CompleteTitle">Complete Your Profile</h1>
                    </Grid.Column>
                    <Grid.Column>
                        <ProgressBar/>
                    </Grid.Column>
                </Grid>
                <Grid textAlign="center">
                    <Grid.Row>
                        <Image centered src='https://react.semantic-ui.com/images/wireframe/white-image.png'
                               size='medium' circular bordered/>
                    </Grid.Row>
                    <Grid.Row>
                        <Icon size='big' circular inverted color='white' name='facebook'/>
                        <Icon size='big' circular inverted color='white' name='instagram'/>
                        <Icon size='big' circular inverted color='white' name='upload'/>
                    </Grid.Row>
                </Grid>
                <Grid columns={1} doubling>
                    <Grid.Column>
                        <Form>
                            <Form.Group widths='equal'>
                                <Form.Input fluid label='Last Name'
                                            color="white"
                                            id="lastName"
                                            value={this.state.lastName}
                                            onChange={this.handleChange}
                                />
                                <Form.Input fluid label='First Name'
                                            value={this.state.firstName}
                                            onChange={this.handleChange} />
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Select
                                    fluid
                                    label='Gender'
                                    id="gender"
                                />
                                <Form.Select
                                    fluid
                                    label='Country'
                                    id="country"
                                />
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Input
                                    fluid
                                    label='Email'
                                    id="email"
                                    value={this.state.email}
                                    onChange={this.handleChange}
                                />
                                <Form.Select fluid
                                             label='Interested By'
                                             color="white"
                                             id="interested"/>
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
                        <Input
                            icon='tags'
                            iconPosition='left'
                            label={{tag: true, content: 'Add Tag'}}
                            labelPosition='right'
                            placeholder='Enter tags'
                        />
                    </Grid.Row>
                    <Grid.Row className="SubmitButton" centered>
                        <Button size="big" onClick={this.handleSave}>Submit</Button>
                    </Grid.Row>
                </Grid>
            </div>
        )
    }
}
export default EditProfil;