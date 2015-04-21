/**
 * UB-RIA-UI 1.0
 * Copyright 2014 Baidu Inc. All rights reserved.
 *
 * @file 富选择控件组合
 * @exports RichSelectorGroup
 * @author lixiang(lixiang05@baidu.com)
 */
define(
    function (require) {
        var u = require('../util');
        /**
         * 富选择控件组合一或两个富选择控件组成，支持单控件选择或左右控件互选
         *
         * 左右选择控件的类型以及配置由使用者通过模板自行定义
         *
         * ```
         * <div
         *   data-ui-type="RichSelectorGroup"
         *   data-ui-id="cas-slots"
         *   data-ui-name="cas-slots">
         *   <esui-table-rich-selector
         *       data-ui-role="source"
         *       data-ui-title="全部有效代码位"
         *       data-ui-has-head="true"
         *       data-ui-has-search-box="true"
         *       data-ui-need-batch-action="true"
         *      data-ui-batch-action-label="选择全部">
         *   </esui-table-rich-selector>
         *   <esui-table-rich-selector
         *       data-ui-role="target"
         *       data-ui-title="已选择代码位"
         *       data-ui-mode="delete"
         *       data-ui-need-batch-action="true"
         *       data-ui-batch-action-label="删除全部"
         *       data-ui-empty-text="请从左侧选择要添加的代码位">
         *   </esui-table-rich-selector>
         * </div>
         *
         * ```
         * 选择控件必须配置data-ui-role，'source'代表源选择器，'target'代表目标选择器
         *
         * @class RichSelectorGroup
         * @extends esui.Panel
         */
        var exports = {};

        /**
         * @override
         */
        exports.type = 'RichSelectorGroup';

        exports.getCategory = function () {
            return 'input';
        };

        /**
         * @override
         */
        exports.initStructure = function () {
            this.helper.initChildren();

            // 获取children
            var selectors = this.children;
            u.each(
                selectors,
                function (selector) {
                    var main = selector.main;
                    var role = selector.main.getAttribute('data-ui-role');
                    if (role) {
                        this[role] = selector;
                    }
                },
                this
            );

            this.source && this.source.on(
                'add',
                function (e) {
                    var newdata = e.target.getSelectedItemsFullStructure();
                    this.target && this.target.setProperties({datasource: newdata});
                    this.fire('add');
                    this.fire('change');
                },
                this
            );

            this.target && this.target.on(
                'delete',
                function (arg) {
                    var items = arg.items;
                    this.source && this.source.selectItems(items, false);
                    this.fire('delete');
                    this.fire('change');
                },
                this
            );
        };

        exports.getRealTargetSelector = function () {
            return this.targret || this.source;
        };

        exports.getValue = function () {
            return this.getRealTargetSelector().getValue();
        };

        exports.getRawValue = function () {
            return this.getRealTargetSelector().getRawValue();
        };

        /**
         * 进行验证
         *
         * @return {boolean}
         */
        exports.validate = function () {
            var target = this.getRealTargetSelector();

            if (typeof target.validate === 'function') {
                return target.validate();
            }
        };

        var RichSelectorGroup = require('eoo').create(require('esui/Panel'), exports);
        require('esui').register(RichSelectorGroup);

        return RichSelectorGroup;
    }
);
