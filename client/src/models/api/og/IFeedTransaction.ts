export interface IFeedTransaction {
    /**
     * The hash.
     */
    hash: string;
    /**
     * The trunk.
     */
    trunk: string;
    /**
     * The branch.
     */
    branch: string;
    /**
     * The transaction value.
     */
    value: number;
    /**
     * The transaction tag.
     */
    tag: string;
    /**
     * The address hash.
     */
    address: string;
    /**
     * The bundle hash.
     */
    bundle: string;
}
