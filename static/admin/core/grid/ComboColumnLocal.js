Ext.define('Core.grid.ComboColumnLocal',{
    extend: 'Core.grid.ComboColumn',
    alias: 'widget.combocolumnlocal',

    constructor: function() {
        if(!this.localeName) {
            this.localeName = localStorage.getItem('locale');
            if(!this.localeName || this.localeName.length!=2) this.localeName = 'en';
        }
        this.callParent(arguments)
    },
    
    defaultRenderer: function(v,x,y,z) {
        //
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
    
                    if(me.guide[i].locales) {
                        for(var j=0;j<me.guide[i].locales.length;j++) {
                            if(me.guide[i].locales[j].key == me.localeName) 
                                return me.guide[i].locales[j].val
                        }
                    }    
                    if(me.guide[i][me.guideValueField]) 
                        return me.guide[i][me.guideValueField];
                    return v;
                }
            }
        }
        return v
    }
});