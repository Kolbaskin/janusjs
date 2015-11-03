Ext.define('Desktop.modules.profile.view.ProfileList', {
    extend: 'Ext.window.Window'
    
    ,width: 650
    ,height: 380
    ,layout: 'border'
    
    ,initComponent: function() {
        this.items = [{
            xtype: 'form',
            defaults: {
                margin: '5',
                xtype: 'fieldcontainer'                
            },
            region: 'center',
            layout: 'column',
            border: false,
            items: [
                this.buildPhotoBlock(),
                this.buildFormFolders()
            ]
        }]
        this.buttons = this.buildButtons()
        this.callParent();
        
    }
    ,buildPhotoBlock: function() {
        return {
            //title: '',
            collapsible: false,
            defaultType: 'textfield',
            defaults: {
                anchor: '100%',
                margin: '5'
            },
            layout: 'anchor',
            width: 270,
            items:[Ext.create('Desktop.modules.profile.view.Photo', { 
                hideLibel: true,
                name: 'photo'
            })]
        }
    }
    
    ,buildFormFolders: function() {
        return {
            //title: '',
            columnWidth: 1,
            collapsible: false,
            defaultType: 'textfield',
            defaults: {
                anchor: '100%',
                msgTarget: 'under',
                margin: '5'
            },
            layout: 'anchor',
            items:[
            {
                name: 'login',
                busyText: D.t('This login name is busy!'),
                fieldLabel: D.t('Login')
            },{
                name: 'pass',
                inputType: 'password',
                fieldLabel: D.t('Password')
            },
            {
                name: 'name',
                fieldLabel: D.t('Name')
            },
            {
                name: 'phone',
                fieldLabel: D.t('Phone')
            },
            {
                name: 'email',
                fieldLabel: D.t('Email')
            },
            {
                name: 'email_sign',
                xtype: 'textarea',
                height: 80,
                fieldLabel: D.t('Signature in the letters')
            },{
                name: '_id',
                hidden: true
            }
            
            ]
        }
    }
    
    ,buildButtons: function() {
        return [
            {text: D.t('Save and close'), scale: 'medium', action: 'formsave'},
            {text: D.t('Save'), scale: 'medium', action: 'formapply'},
            '-',
            {text: D.t('Close'), scale: 'medium', action: 'formclose'}
        ]    
    }
    
})