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
import './EditProfil.css';

const ProgressBar = () => <Progress percent={60}
                                    className="ProgressBarProfile"
                                    progress
                                    size="large"/>

function EditProfil (props) {
    return (
        <div className="ui middle EditProfil">
                <Grid columns={2} doubling>
                    <Grid.Column>
                        <h1 className="CompleteTitle">Complete Your Profile</h1>
                    </Grid.Column>
                    <Grid.Column>
                        <ProgressBar />
                    </Grid.Column>
                </Grid>
                <Grid textAlign="center">
                    <Grid.Row>
                        <Image centered src='https://react.semantic-ui.com/images/wireframe/white-image.png' size='medium' circular bordered />
                    </Grid.Row>
                    <Grid.Row>
                        <Icon size='big' circular inverted color='white' name='facebook' />
                        <Icon size='big' circular inverted color='white' name='instagram' />
                        <Icon size='big' circular inverted color='white' name='upload' />
                    </Grid.Row>
                </Grid>
                <Grid columns={1} doubling>
                    <Grid.Column>
                        <Form>
                            <Form.Group widths='equal'>
                                <Form.Input fluid label='Last Name' color="white" />
                                <Form.Input fluid label='First Name' />
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Select
                                    fluid
                                    label='Gender'
                                />
                                <Form.Select
                                    fluid
                                    label='Country'
                                />
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Input
                                    fluid
                                    label='Email'
                                />
                                <Form.Select fluid label='Interested By' color="white" />
                            </Form.Group>
                            <Form.Field
                                label='Bio'
                                control={TextArea}
                            />
                        </Form>
                    </Grid.Column>
                    <Grid.Row centered>
                            <Input
                                icon='tags'
                                iconPosition='left'
                                label={{ tag: true, content: 'Add Tag' }}
                                labelPosition='right'
                                placeholder='Enter tags'
                            />
                    </Grid.Row>
                    <Grid.Row className="SubmitButton" centered >
                        <Button size="big">Submit</Button>
                    </Grid.Row>
                </Grid>
            </div>
    )
}

export default EditProfil;