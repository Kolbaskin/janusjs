Ext.define('Desktop.modules.profile.model.ProfileModel', {
    extend: 'Core.data.DataModel'
    
    ,collection: 'admin_users'

    ,fields: [
    {
        name: '_id',
        type: 'ObjectID',
        visible: true
    },
    {
        name: 'login',
        type: 'string',
        filterable: true,
        unique: true,
        editable: true,
        visible: true
    },
    {
        name: 'name',
        type: 'string',
        filterable: true,
        editable: true,
        visible: true
    },{
        name: 'fname',
        type: 'string',
        filterable: true,
        editable: true,
        visible: true
    },{
        name: 'phone',
        type: 'string',
        filterable: true,
        editable: true,
        visible: true
    },{
        name: 'photo',
        type: 'image',
        filterable: false,
        editable: true,
        visible: true
    },
    {
        name: 'email',
        type: 'string',
        filterable: true,
        vtype: 'email',
        editable: true,
        visible: true
    },
    {
        name: 'email_sign',
        type: 'string',
        filterable: false,
        editable: true,
        visible: true
    },
    {
        name: 'pass',
        type: 'password',
        editable: true,
        visible: false
    }]


    // Запретим удалять пользователей
    ,beforeRemove: function(data, callback) {
        callback(null)
    }

    // Профиль можно менять только у себя
    // и логин не должен дублировать логин другого юзера
    ,beforeSave: function(data, callback) {    
        var me = this

        
        if(me.user && me.user.id) {        
            me.src.db.collection('admin_users').findOne({login: data.login}, {_id:1}, function(e,dt) {
                if(!dt || (dt._id+'') == (me.user.id+'')) {
                    data._id = me.user.id+''
                    callback(data)
                } else {
                    callback(null)
                }
            })
        }
    }
    
    ,getMyInfo: function(callback) {
        this.runOnServer('getMyInfo', callback)
    }
    
    ,$getMyInfo: function(data, callback) {
        var me = this
        if(me.user && me.user.id) {        
            me.src.db.collection('admin_users').findOne({_id: me.user.id}, {}, function(e,dt) {
                if(dt)
                    me.prepRecord(dt, callback)
                else
                    callback(null)
            })
        }
    }
    
    ,checkLogin: function(login, callback) {
        this.runOnServer('checkLogin', {login: login}, callback)    
    }
    
    ,$checkLogin: function(data, callback) {
        var me = this;
        me.beforeSave(data, function(res) {
            callback({success: !!res})
        })
    }
})