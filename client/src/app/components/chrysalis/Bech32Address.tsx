/* eslint-disable max-len */
import React, { Component, ReactNode } from "react";
import { ClipboardHelper } from "../../../helpers/clipboardHelper";
import MessageButton from "../MessageButton";
import { Bech32AddressProps } from "./Bech32AddressProps";

/**
 * Component which will display an Bech32Address.
 */
class Bech32Address extends Component<Bech32AddressProps> {
    /**
     * Create a new instance of Bech32Address.
     * @param props The props.
     */
    constructor(props: Bech32AddressProps) {
        super(props);

        this.state = {
        };
    }

    /**
     * Render the component.
     * @returns The node to render.
     */
    public render(): ReactNode {
        return (
            <div className="bech32-address">
                {this.props.addressDetails?.bech32 && (
                    <React.Fragment>
                        <div className="card--label">
                            Address
                        </div>
                        <div className="card--value row middle">
                            {this.props.history && (
                                <button
                                    type="button"
                                    className="margin-r-t"
                                    onClick={() => this.props.history?.push(
                                        `/${this.props.network
                                        }/addr/${this.props.addressDetails?.bech32}`)}
                                >
                                    {this.props.addressDetails.bech32}
                                </button>
                            )}
                            {!this.props.history && (
                                <span className="margin-r-t">{this.props.addressDetails.bech32}</span>
                            )}
                            <MessageButton
                                onClick={() => ClipboardHelper.copy(this.props.addressDetails?.bech32)}
                                buttonType="copy"
                                labelPosition="top"
                            />
                        </div>
                    </React.Fragment>
                )}
                {this.props.addressDetails?.typeLabel && this.props.addressDetails?.hex && (
                    <React.Fragment>
                        <div className="card--label">
                            {this.props.addressDetails.typeLabel} Address
                        </div>
                        <div className="card--value row middle">
                            {this.props.history && (
                                <button
                                    type="button"
                                    className="margin-r-t"
                                    onClick={() => this.props.history?.push(
                                        `/${this.props.network
                                        }/addr/${this.props.addressDetails?.hex}`)}
                                >
                                    {this.props.addressDetails?.hex}
                                </button>
                            )}
                            {!this.props.history && (
                                <span className="margin-r-t">{this.props.addressDetails?.hex}</span>
                            )}
                            <MessageButton
                                onClick={() => ClipboardHelper.copy(this.props.addressDetails?.hex)}
                                buttonType="copy"
                                labelPosition="top"
                            />
                        </div>
                    </React.Fragment>
                )}
            </div>
        );
    }
}

export default Bech32Address;
