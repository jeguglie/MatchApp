import React from 'react';
import CardsBuilder from "../CardsBuilder/CardsBuilder";
import Aux from '../../../Server.Client/client/src/hoc/Aux';
import ModalViewProfil from "../../components/UI/Modal/ModalViewProfil/ModalViewProfil";
import UserCoverPic from "../../components/UserCoverPic/UserCoverPic";

class  WallUserCover extends React.Component {

    state = {
        user: {
            user1: "https://cdn.linvosges.com/mediatheque/images-categories/gammes/peignoir-homme-matin-d-hiver/zoom/peignoir-homme-matin-d-hiver_1.jpg",
            user2: "https://cdn.linvosges.com/mediatheque/images-categories/gammes/peignoir-homme-matin-d-hiver/zoom/peignoir-homme-matin-d-hiver_1.jpg",
            user3: "https://cdn.linvosges.com/mediatheque/images-categories/gammes/peignoir-homme-matin-d-hiver/zoom/peignoir-homme-matin-d-hiver_1.jpg",
            user4: "https://cdn.linvosges.com/mediatheque/images-categories/gammes/peignoir-homme-matin-d-hiver/zoom/peignoir-homme-matin-d-hiver_1.jpg",
            user5: "https://cdn.linvosges.com/mediatheque/images-categories/gammes/peignoir-homme-matin-d-hiver/zoom/peignoir-homme-matin-d-hiver_1.jpg",
            user6: "https://cdn.linvosges.com/mediatheque/images-categories/gammes/peignoir-homme-matin-d-hiver/zoom/peignoir-homme-matin-d-hiver_1.jpg",
            user7: "https://cdn.linvosges.com/mediatheque/images-categories/gammes/peignoir-homme-matin-d-hiver/zoom/peignoir-homme-matin-d-hiver_1.jpg",
        },
        showCardUser: false,
        viewUser: null
    };

    // componentDidMount() {
    //     await API.getUsersCover.then()
    // }

    closeCard = () => {
        this.setState({showCardUser: false});
        this.props.modalNotActive();
    };
    showCard = () => {
        this.setState({showCardUser: true});
        this.props.modalActive();
    };
    modalActive = () => this.props.modalActive;


    render() {
        let modal;
        let showCard = this.showCard;
        if (this.state.showCardUser) {
            modal = (
                <ModalViewProfil
                    show={this.state.showCardUser}
                    modalClosed={this.closeCard} >
                    <CardsBuilder renderCard={this.state.showCardUser} user={this.state.viewUser}/>
                </ModalViewProfil>
            )
        }
        return (
            <Aux>
                {modal}
                {
                    Object.values(this.state.user).map(function (src, index) {
                        return <UserCoverPic clicked={showCard}
                                             key={index}
                                             src={src} />
                    })
                }
            </Aux>
        )
    }
}

export default WallUserCover;