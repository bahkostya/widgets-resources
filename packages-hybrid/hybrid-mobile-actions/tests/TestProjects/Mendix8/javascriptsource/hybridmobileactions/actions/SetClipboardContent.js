// This file was generated by Mendix Studio Pro.
//
// WARNING: Only the following code will be retained when actions are regenerated:
// - the import list
// - the code between BEGIN USER CODE and END USER CODE
// - the code between BEGIN EXTRA CODE and END EXTRA CODE
// Other code you write will be lost the next time you deploy the project.
import { Big } from "big.js";

// BEGIN EXTRA CODE
// END EXTRA CODE

/**
 * Store text content in top device clipboard.x
 * @param {string} content - This field is required.
 * @returns {Promise.<void>}
 */
export async function SetClipboardContent(content) {
    // BEGIN USER CODE
    // Documentation https://www.npmjs.com/package/cordova-clipboard
    // Requires cordova-clipboard plugin
    if (!cordova.plugins || !cordova.plugins.clipboard) {
        throw new Error("SetClipboardContent action requires cordova-clipboard plugin to be installed in the app");
    }
    if (!content) {
        throw new Error("Input parameter 'Content' is required.");
    }
    cordova.plugins.clipboard.copy(content);
    return Promise.resolve();
    // END USER CODE
}
