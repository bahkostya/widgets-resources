import { font, input }              from "../variables";
import { TextBox, TextBoxVertical } from "./textbox";
import { DropDownType }             from "../../types/widgets";
/*

DISCLAIMER:
Do not change this file because it is core styling.
Customizing core files will make updating Atlas much more difficult in the future.
To customize any core styling, copy the part you want to customize to styles/native/app/ so the core styling is overwritten.

==========================================================================
    Drop Down

    Default Class For Mendix Drop Down Widget
========================================================================== */
export const DropDown: DropDownType = {
    container: {
        // All ViewStyle properties are allowed
        ...TextBox.container,
    },
    label: {
        // numberOfLines and all TextStyle properties are allowed
        ...TextBox.label,
    },
    value: {
        // All TextStyle properties & placeholderTextColor are allowed
        color: input.input.color,
        borderColor: input.input.borderColor,
        backgroundColor: input.input.backgroundColor,
        placeholderTextColor: input.input.placeholderTextColor, // Only applied when useUniformDesign is true

        fontSize: input.input.fontSize,
        lineHeight: input.input.lineHeight,
        fontFamily: font.family,
        borderWidth: input.input.borderWidth,
        borderRadius: input.input.borderRadius,

        overflow: "hidden",
        textAlignVertical: "center",
        minWidth: input.input.minWidth,
        minHeight: input.input.minHeight,
        paddingHorizontal: input.input.paddingHorizontal,
        paddingVertical: input.input.paddingVertical,

    },
    valueDisabled: {
        // All TextStyle properties are allowed
        backgroundColor: input.inputDisabled.backgroundColor,
    },
    validationMessage: {
        // All TextStyle properties are allowed
        ...TextBox.validationMessage,
    },
    /*  New dropdown styles start */
    valueContainer: {
        // All ViewStyle properties & rippleColor are allowed
        rippleColor: input.valueContainer.rippleColor,
    },
    menuWrapper: {
        // All ViewStyle properties are allowed
        overflow: "hidden",
        borderRadius: input.input.borderRadius,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 16,
    },
    itemContainer: {
        // All ViewStyle properties are allowed
        maxWidth: input.itemContainer.maxWidth,
        paddingVertical: input.itemContainer.paddingVertical,
        paddingHorizontal: input.itemContainer.paddingHorizontal,
        backgroundColor: input.itemContainer.backgroundColor,
    },
    item: {
        // All TextStyle properties are allowed
        color: input.item.color,
        fontSize: input.item.fontSize,
    },
    selectedItem: {
        // All TextStyle properties are allowed
        color: input.selectedItem.color,
        fontSize: input.selectedItem.fontSize,
        backgroundColor: "transparent",
    },
    selectedItemContainer: {
        // All ViewStyle properties are allowed
        borderWidth: input.selectedItemContainer.borderWidth,
        borderRadius: input.selectedItemContainer.borderRadius,
        borderColor: input.selectedItemContainer.borderColor,
        backgroundColor: input.selectedItemContainer.backgroundColor,
    },
    /*  New dropdown styles end */
    useUniformDesign: true,
    /*  Old dropdown styles start */
    pickerIOS: {
        // All ViewStyle properties are allowed
        backgroundColor: input.input.backgroundColor,
    },
    pickerItemIOS: {
        // All TextStyle properties are allowed
    },
    pickerBackdropIOS: {
        // All ViewStyle properties are allowed
    },
    pickerTopIOS: {
        // All ViewStyle properties are allowed
        backgroundColor: input.input.backgroundColor,
    },
    /*  Old dropdown styles start */
};
export const DropDownVertical: DropDownType = {
    container: TextBoxVertical.container,
    label: TextBoxVertical.label,
    value: DropDown.value,
    validationMessage: TextBoxVertical.validationMessage,
    valueContainer: DropDown.valueContainer,
    menuWrapper: DropDown.menuWrapper,
    itemContainer: DropDown.itemContainer,
    item: DropDown.item,
    useUniformDesign: DropDown.useUniformDesign,
    pickerIOS: DropDown.pickerIOS,
    pickerItemIOS: DropDown.pickerItemIOS,
    pickerBackdropIOS: DropDown.pickerBackdropIOS,
    pickerTopIOS: DropDown.pickerTopIOS,
};
