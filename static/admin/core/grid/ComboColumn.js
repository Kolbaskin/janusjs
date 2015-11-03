/**
 * @author Max Tushev
 * @class Core.grid.ComboColumn
 * @extend Ext.grid.column.Column
 *     
 *     @example
 *     Ext.define('Desktop.module.mymodule.view.MyModuleList', {
 *         extend: 'Core.grid.GridWindow',
 *         requires: ['Core.grid.ComboColumn'],
 *         buildColumns: function() {
 *             return [
 *                 {
 *                     xtype: 'combocolumn',
 *                     dataIndex: 'fieldName1',
 *                     sortable: true,    
 *                     text: 'Column name 1',
 *                     model: 'Desktop.module.myguide.model.MyGuideModel',
 *                     guideKeyField: 'code',
 *                     guideValueField: 'text'
 *                 },
 *                 {
 *                     dataIndex: 'fieldName2',
 *                     sortable: true,
 *                     text: 'Column name 2'
 *                 }
 *             ]
 *         }
 *     })    
 */
Ext.define('Core.grid.ComboColumn',{
    extend: 'Ext.grid.column.Column',
    alias: 'widget.combocolumn',

    /**
     * @param {String} guideKeyField default: _id
     */
    
    /**
     * @param {String} guideValueField default: name
     */
    
    
    constructor: function() {
        this.guide = null
        this.guideKeyField = '_id'
        this.guideValueField = 'name'
        
        this.callParent(arguments)
    },
    
    defaultRenderer: function(v,x,y,z) {
        //console.log('def:',this)
        var me = this
        if(me.guide == 'loading') {
        // пока справочник загружается, ждемс
        // через таймаут повторяем попытку рендера со справочником
            setTimeout(function() {y.commit()}, 100)
            return '';
        }
        if(me.guide === null) {
        // Если нет справочника               
            if(me.model) {
                // если задан url, прочитаем справочник по нему
                me.guide = 'loading'            
                if(Ext.isString(me.model)) 
                    me.model = Ext.create(me.model)
                me.model.runOnServer('read', function(data) {
                    me.guide = data.list
                })
                setTimeout(function() {y.commit()}, 100)
            }
            
            return '';
        }
        
        if(me.guide) {
            for(var i=0;i<me.guide.length;i++) {
                if(me.guide[i][me.guideKeyField] && me.guide[i][me.guideKeyField] == v) {
                    if(me.returnFullRecord)
                        return me.guide[i]
                    if(me.guide[i][me.guideValueField]) 
                        return me.guide[i][me.guideValueField];
                    return v;
                }
            }
        }
        return v
    }
});