import React from "react";
import { Beneficts } from "../beneficts/Beneficts";
import { CallToAction } from "../call to action/CallToAction";
import { IntroductionText } from "../introductionText/IntroductionText";

import { SalesChannels } from "../salesChannels/SalesChannels";
import "./main.scss";
import { ItemListContainerIndex } from "../itemListContainerIndex/ItemListContainerIndex";

export const Main = () => {
    return (
        <div className="mainContainer">
            <CallToAction> </CallToAction>
            <IntroductionText> </IntroductionText>
            <Beneficts> </Beneficts>
            <ItemListContainerIndex/>
            <SalesChannels/>
        </div>
    )
}