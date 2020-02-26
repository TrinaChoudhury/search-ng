/**
 * Config for modal entity to be rendered
 */
export interface ModalEntityConfig {
    /**
     * Selector for entity to be rendered inside modal's body
     */
    internalEntitySelector: string;

    /**
     * Title of Modal
     */
    title?: string;

    /**
     * Backdrop effect to be shown or not
     */
    backdrop?: boolean;

    /**
     * To close modal on outside click or not
     */
    ignoreBackdropClick?: boolean;

    css?: string;
}
