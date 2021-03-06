import { ReactNode } from "react";

/**
 * The props for the Header component.
 */
export interface HeaderProps {
    /**
     * The root path.
     */
    rootPath: string;

    /**
     * The switch elements to display as content.
     */
    switcher?: ReactNode;

    /**
     * The search elements to display as content.
     */
    search?: ReactNode;

    /**
     * Tools menu
     */
    tools?: {
        /**
         * The label for the tool.
         */
        label: string;

        /**
         * The link for the tool.
         */
        url: string;

        /**
         * The icon to display.
         */
        icon: string;
    }[];
}
