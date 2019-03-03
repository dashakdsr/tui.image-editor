/**
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 * @fileoverview Change a text
 */
import commandFactory from '../factory/command';
import Promise from 'core-js/library/es6/promise';
import consts from '../consts';
import snippet from 'tui-code-snippet';

const {componentNames, rejectMessages, commandNames} = consts;
const {TEXT} = componentNames;

const command = {
    name: commandNames.CHANGE_TEXT,

    /**
     * Change a text
     * @param {Graphics} graphics - Graphics instance
     * @param {number} id - object id
     * @param {string} styles - Changing text
     * @returns {Promise}
     */
    execute(graphics, id, styles) {
        const textComp = graphics.getComponent(TEXT);
        if (id.length) {
            for (let i = 0; i < id.length; i += 1) {
                const targetObj = graphics.getObject(id[i]);
                if (!targetObj) {
                    return Promise.reject(rejectMessages.noObject);
                }
                this.undoData.object = targetObj;
                this.undoData.styles = {};
                snippet.forEachOwnProperties(styles, function(value, key) {
                    this.undoData.styles[key] = targetObj[key];
                });
                if (i === id.length - 1) {
                    return textComp.setStyle(targetObj, styles);
                }
                textComp.setStyle(targetObj, styles);
            }
        } else {
            const targetObj = graphics.getObject(id);
            if (!targetObj) {
                return Promise.reject(rejectMessages.noObject);
            }
            this.undoData.object = targetObj;
            this.undoData.styles = {};
            snippet.forEachOwnProperties(styles, function(value, key) {
                this.undoData.styles[key] = targetObj[key];
            });

            return textComp.setStyle(targetObj, styles);
        }

        return new Promise();
    },
    /**
     * @param {Graphics} graphics - Graphics instance
     * @returns {Promise}
     */
    undo(graphics) {
        const textComp = graphics.getComponent(TEXT);
        const {object: textObj, text} = this.undoData;

        return textComp.change(textObj, text);
    }
};

commandFactory.register(command);

module.exports = command;
