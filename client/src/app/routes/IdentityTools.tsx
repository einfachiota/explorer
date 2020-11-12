import classNames from "classnames";
import React, { ReactNode } from "react";
import { RouteComponentProps } from "react-router-dom";
import { ServiceFactory } from "../../factories/serviceFactory";
import { ClipboardHelper } from "../../helpers/clipboardHelper";
import { TrytesHelper } from "../../helpers/trytesHelper";
import { TangleCacheService } from "../../services/tangleCacheService";
import AsyncComponent from "../components/AsyncComponent";
import MessageButton from "../components/MessageButton";
import Spinner from "../components/Spinner";
import "./IdentityTools.scss";
import { StreamsV0RouteProps } from "./StreamsV0RouteProps";
import { StreamsV0State } from "./StreamsV0State";

/**
 * Component which will show the streams v0 page.
 */
class IdentityTools extends AsyncComponent<RouteComponentProps<StreamsV0RouteProps>, StreamsV0State> {
    /**
     * API Client for tangle requests.
     */
    private readonly _tangleCacheService: TangleCacheService;

    /**
     * Update timer.
     */
    private _updateTimer?: NodeJS.Timer;

    /**
     * Next Root to retrieve from.
     */
    private _nextRoot?: string;

    /**
     * Packet timout.
     */
    private _timeout: number;

    /**
     * Create a new instance of StreamsV0.
     * @param props The props.
     */
    constructor(props: RouteComponentProps<StreamsV0RouteProps>) {
        super(props);

        this._tangleCacheService = ServiceFactory.get<TangleCacheService>("tangle-cache");
        this._timeout = 100;

        this.state = {
            statusBusy: false,
            status: "",
            root: props.match.params.hash ?? "",
            rootValidation: "",
            mode: props.match.params.mode ?? "public",
            sideKey: props.match.params.key ?? "",
            sideKeyValidation: "",
            isValid: false,
            packets: []
        };
    }

    /**
     * The component mounted.
     */
    public async componentDidMount(): Promise<void> {
        super.componentDidMount();

        if (this.state.root.length > 0) {
            this.findData();
        }

        window.scrollTo({
            left: 0,
            top: 0,
            behavior: "smooth"
        });
    }

    /**
     * The component will unmount from the dom.
     */
    public async componentWillUnmount(): Promise<void> {
        this.stopData();
    }

    /**
     * Render the component.
     * @returns The node to render.
     */
    public render(): ReactNode {
        return (
            <div className="streams-v0">
                <div className="wrapper">
                    <div className="inner">
                        <h1>Identity Tools</h1>
                        <div className="row">
                            <div className="cards">
                                <div className="card">
                                    <div className="card--header card--header__space-between">
                                        <h2>DID Resolver</h2>
                                    </div>
                                    <div className="card--content">
                                        <div className="row middle margin-b-s row--tablet-responsive">
                                            <div className="card--label form-label-width">
                                                DID
                                            </div>
                                            <input
                                                type="text"
                                                value={this.state.root}
                                                onChange={e => this.setState(
                                                    { root: e.target.value.toUpperCase() }, () => this.validate()
                                                )}
                                                disabled={this.state.statusBusy}
                                                className="form-input-long"
                                                // maxLength={81}
                                            />
                                        </div>
                                        {this.state.rootValidation && (
                                            <div className="row danger form-validation row--tablet-responsive">
                                                <div className="card--label form-label-width">&nbsp;</div>
                                                {this.state.rootValidation}
                                            </div>
                                        )}
                                        <div className="row margin-b-s row--tablet-responsive">
                                            <div className="card--label form-label-width">
                                                &nbsp;
                                            </div>
                                            <button
                                                type="button"
                                                className="form-button selected margin-r-t margin-b-t"
                                                onClick={() => this.resolveDID()}
                                                disabled={this.state.statusBusy || !this.state.isValid}
                                            >
                                                Resolve
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }

    /**
     * Decode the trytes into its fields.
     * @returns True if valid.
     */
    private validate(): boolean {

        // dev start
        this.setState({
            isValid: true
        });
        return true;
        // dev end
        
        let rootValidation = "";
        let sideKeyValidation = "";

        const root = this.state.root.toUpperCase();
        if (root.length > 0) {
            if (root.length < 9 || root.length > 57) {
                rootValidation = `The DID length is invalid, it is ${root.length}.`;
            }

            if (root.slice(0, 9) != 'did:iota:') {
                rootValidation = "Invalid DID";
            }
        }

        if (this.state.mode === "restricted") {
            if (this.state.sideKey.trim().length === 0) {
                sideKeyValidation = "You must specify a key for restricted mode.";
            }
        }

        this.setState({
            rootValidation,
            sideKeyValidation,
            isValid: root.length > 0 && rootValidation.length === 0 && sideKeyValidation.length === 0
        });

        return rootValidation.length === 0 && sideKeyValidation.length === 0;
    }

    /**
     * Find the data from the v0 channel.
     */
    private findData(): void {
        const isValid = this.validate();

        if (isValid) {

            console.log("valid ID -> ask backend")

            // let url = `/${this.props.match.params.network}/streams/0/${this.state.root}/${this.state.mode}`;
            // if (this.state.mode === "restricted") {
            //     url += `/${this.state.sideKey}`;
            // }
            // if (this.props.location.pathname !== url) {
            //     this.props.history.replace(url);
            // }
            // this.setState(
            //     {
            //         statusBusy: true,
            //         status: "Waiting for channel data...",
            //         packets: []
            //     },
            //     async () => {
            //         this._nextRoot = this.state.root;
            //         this._timeout = 100;
            //         await this.loadNextPacket(true);
            //     });
        }
    }


     /**
     * Resolve the DID
     */

    private resolveDID(): void {

        const isValid = this.validate();

        if (isValid) {

            console.log("valid ID -> ask backend")


        console.log("resolveDID")

            this.setState(
                {
                    statusBusy: true,
                    status: "Waiting for DID documents...",
                    packets: []
                },
                async () => {
                    this._timeout = 100;
                    await this.loadDID(true);
                }
            )
        }
    }

    private async loadDID(force?: boolean): Promise<void> {

        console.log("loadDID")
        
        const did = await this._tangleCacheService.resolveDID(this.props.match.params.network, "did:iota:3tukwL7jMP5cfxtUB8je7wAUkaPSAgBMeGnY6YBivpHf")
        
        console.log("did: ", did)

    }



    /**
     * Stop loading the data.
     */
    private stopData(): void {
        if (this._updateTimer) {
            clearTimeout(this._updateTimer);
            this._updateTimer = undefined;
        }
        this.setState({ statusBusy: false, status: "" });
    }

    

    /**
     * Load the next packet from the channel.
     * @param force Force the read to start.
     */
    private async loadNextPacket(force?: boolean): Promise<void> {
        if (this._nextRoot && (this._updateTimer || force) && this.state.statusBusy) {
            const packet = await this._tangleCacheService.getStreamsV0Packet(
                this.props.match.params.network, this._nextRoot, this.state.mode, this.state.sideKey);

            if (packet) {
                const packets = this.state.packets;
                const decoded = TrytesHelper.decodeMessage(packet.payload);

                packets.push({
                    root: this._nextRoot,
                    nextRoot: packet.nextRoot,
                    tag: packet.tag,
                    message: decoded.message,
                    messageType: decoded.messageType,
                    rawMessageTrytes: packet.payload,
                    showRawMessageTrytes: false
                });

                this.setState({ packets });

                this._nextRoot = packet.nextRoot;
                this._timeout = 100;
            } else if (this._timeout < 10000) {
                this._timeout += 500;
            }
            if (this._updateTimer) {
                clearTimeout(this._updateTimer);
            }
            this._updateTimer = setTimeout(async () => this.loadNextPacket(), this._timeout);
        }
    }
}

export default IdentityTools;
