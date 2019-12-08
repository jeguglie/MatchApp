import React, { useState } from 'react';
// import './CardsBuilder.css';
import BottomCard from '../../../Server.Client/client/src/components/BottomCard/BottomCard';
import InfoConnect from "../../components/UI/InfoConnect/InfoConnect";
import Modal from '../../components/UI/Modal/Modal';
import Hashtags from '../../../Server.Client/client/src/components/BottomCard/Hashtags/Hashtags';
import SignalUserConfirmation from "../../components/UI/SignalUser/SignalUserConfirmation/SignalUserConfirmation";
import TopCard from "../../components/TopCard/TopCard";

class CardsBuilder extends React.Component {
    state = {
        src: ['https://cdn.linvosges.com/mediatheque/images-categories/gammes/peignoir-homme-matin-d-hiver/zoom/peignoir-homme-matin-d-hiver_1.jpg', 'https://cdn.linvosges.com/mediatheque/images-categories/gammes/t-shirt-homme-au-vestiaire/zoom/t-shirt-homme-au-vestiaire.jpg', 'https://cdn.monsieurtshirt.com/images/3602/product_large/t-shirt-homme-l-homme-ideal.jpg?1543050264488'],
        title: 'Gogdn',
        bio: "Petite phrase pour remplir ce superbe cadre ...... 12345672359350353059",
        // nbrImg: [1, 2, 3, 4],
        gender: 'female',
        infoConnect: 'Disconnected',
        infoConnectStatus: 'Offline',
        hashtags: ["#grosseek", "#bio", "#yeslife", "#react", "#test", "#Yeslife", "#sut", "#OK"],
        currentImg: 1,
        showHashTags: false,
        showSignalUserModal: false
    };
    nextImage = () => {
        if (this.state.currentImg + 1 < this.state.src.length)
            this.setState({currentImg: this.state.currentImg + 1});
    };
    prevImage = () => {
        if (this.state.currentImg > 0)
            this.setState({currentImg: this.state.currentImg - 1});
    };
    showHashTags = () => this.setState({showHashTags: true});
    closeHashTags = () => this.setState({showHashTags: false});
    showSignalUserModal = () => this.setState({showSignalUserModal: true});
    closeSignalUserModal = () => this.setState({showSignalUserModal: false});
    render() {
        let modalHashtags;
        let modalSignalUser;

        if (this.state.showHashTags){
            modalHashtags = (
                <Modal
                    show={this.state.showHashTags}
                    modalClosed={this.closeHashTags}>
                    <div className="Interests"><h1 className="h1Text">Interests of {this.state.title}</h1></div>
                    <Hashtags
                        gender={this.state.gender}
                        isModalHashtags="true"
                        hashtags={this.state.hashtags}/>
                </Modal>
            )
        }
        if (this.state.showSignalUserModal){
            modalSignalUser = (
                <Modal
                    show={this.state.showSignalUserModal}
                    modalClosed={this.closeSignalUserModal}>
                    <SignalUserConfirmation
                        name={this.state.title}
                        SignalUserNo={this.closeSignalUserModal}
                        SignalUserYes={this.closeSignalUserModal}/>
                </Modal>
            )
        }
        if (this.props.renderCard === true) {
        return (
            <div className="Card">
                {modalHashtags}
                {modalSignalUser}
                <InfoConnect
                    infoConnectStatus={this.state.infoConnectStatus}
                    infoConnect={this.state.infoConnect}/>
                <div className="CardsBuilder">
                    <TopCard
                        src={this.state.src[this.state.currentImg]}
                        name={this.state.title}
                        nbrImg={this.state.src}
                        gender={this.state.gender}
                        nextImage={this.nextImage}
                        prevImage={this.prevImage}
                        currentImg={this.state.currentImg}
                        showSignalUserModal={this.showSignalUserModal}/>
                    <BottomCard
                        bio={this.state.bio}
                        hashtags={this.state.hashtags}
                        gender={this.state.gender}
                        showHashTags={this.showHashTags}/>
                </div>
            </div>
        );
        }
        else
            return null;
}
}

export default CardsBuilder;
