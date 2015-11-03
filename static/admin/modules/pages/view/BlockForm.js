Ext.define('Desktop.modules.users.view.UserForm', {
    extend: 'Desktop.core.DetailForm',
    
    titleIndex: 'login',
    
    buildItems: function() {
        return [
        {
            name: 'login',
            fieldLabel: D.t('Login')
        },
        {
            name: 'email',
            fieldLabel: D.t('Email')
        },
        {
            name: 'pass',
            inputType: 'password',
            fieldLabel: D.t('Password')
        }
        ]
    }
    
})