/**
 * @author Max Tushev
 * @scope Server, Client
 * The model for Users module 
 * @private
 */
Ext.define('Desktop.modules.users.model.UsersModel', {    
    extend: "Core.data.DataModel"

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
        name: 'dblauth',
        type: 'boolean',
        editable: true,
        visible: true
    },
    {
        name: 'pass',
        type: 'password',
        editable: true,
        visible: false
    },
    {
        name: 'groupid',
        type: 'ObjectID',
        editable: true,
        visible: true
    },{
        name: 'xgroups',
        type: 'array',
        editable: true,
        visible: true,
        itemsType: 'ObjectID'
    },{
        name: 'tel',
        type: 'string',
        filterable: true,
        editable: true,
        visible: true
    },{
        name: 'act1',
        type: 'boolean',
        filterable: true,
        editable: true,
        visible: true
    },{
        name: 'state',
        type: 'int',
        filterable: false,
        editable: true,
        visible: true
    }]
    
    ,checkUnicLogin: function(data, cb) {
        this.runOnServer('checkUnicLogin', data, cb)    
    }
    
    ,$checkUnicLogin: function(data, cb) {
        var me = this;
        if(data._id && data.login) {
            me.dbCollection.findOne({
                login: data.login,
                _id: {$ne: me.src.db.fieldTypes.ObjectID.getValueToSave(me, data._id)}
            },{_id:1},function(e,d) {
                cb({isset: (!!d && d._id)})
            })
        }
    }
    
    ,changeUserState: function(_id, state, cb) {
        var me = this;
        [
            function(next) {
                if(Ext.isString(_id)) {
                    me.src.db.fieldTypes.ObjectID.getValueToSave(me, _id, null, null, null, function(id) {
                        _id = id;
                        next()
                    })
                } else 
                    next()
            }
            ,function(next) {
                me.src.db.collection(me.collection).findOne({_id: _id}, {_id: 1, login: 1}, function(e, u) {
                    if(u) {
                        next(u)    
                    }
                })
            }
            ,function(user) {
                me.src.db.collection(me.collection).update({_id: user._id}, {$set: {state: state}}, function(e, u) {
                    user.state = state;
                    me.changeModelData(Object.getPrototypeOf(me).$className, 'changeState', user)
                    cb()
                })
            }
        ].runEach()
    }
})