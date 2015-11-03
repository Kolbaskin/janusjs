Ext.define('Core.grid.Scheduler', {
    extend: 'Ext.grid.Panel'
    
    
    ,alias: 'widget.schedulertree'
    
    ,defaultDays: 30
    ,defaultDate: new Date()
    ,viewConfig: null
    ,lineHeight: 35
    
    ,bookTpl: new Ext.XTemplate('<span>{[values.res_num? "#"+values.res_num+" ":""]}<b>{title}</b><br>{notes}</span>')
    
    ,initComponent: function() {    
        var me = this;
        me.columnLines = true
        me.rowLines = true
        me.store = me.createStore()
        me.on('resize', function() {me.rebuildColumns(this.defaultDate, this.defaultDays)})
        me.on('cellmousedown', function(a1, a2, a3, a4, a5, a6, a7, a8) {me.cellMouseDown(a1, a2, a3, a4, a5, a6, a7, a8)})
        me.on('cellmouseup', function(a1, a2, a3, a4, a5, a6, a7, a8) {me.cellMouseUp(a1, a2, a3, a4, a5, a6, a7, a8)})
        me.on('itemmouseenter', function(th, record, item, index, e, eop) {me.fixItemOver(index)})
        me.store.on('load', function(th, n, r) {me.getRecordsArr();me.getBookings();me.addMousemoveEvent();})
        me.on('itemexpand', function(e) {me.nodeSetState(e.data._id, true);return true;})
        me.on('itemcollapse', function(e) {me.nodeSetState(e.data._id, false);return true;})
        me.on('beforeitemcollapse', function(e) {if(me.noCollapseLog) {me.noCollapseLog=false;return false;}})
        me.addEvents(
            'selectrange',
            'bookingclick'
        );
        this.columns = this.buildMainColumns()
        this.callParent(arguments)
    }
    
    ,getRecordsArr: function() {
        var me = this;
        me.records = {}
        me.store.each(function(r) {  
            me.records[r.data.id] = r;    
        })
    }
    
    ,createStore: function() {
        var me = this
        if(me.store) return Ext.create(me.store)
        return Ext.create('Core.data.Store', {
            filterParam: 'q',
            remoteFilter: true,
            dataModel: me.model,
            scope: this,
            fieldSet: me.fields
        })
    }
    
    ,buildColumns: function() {
        return []
    }
    
    ,buildMainColumns: function() {
        var me = this;
        return [{
                text: D.t('Hotel'),
                width: 105,
                resizable: false,
                sortable: false,
                menuDisabled: true,
                //dataIndex: 'hotel_',
                renderer : function(v,m,r) {
                    m.style = "height: " + me.lineHeight +"px;"
                    if(r.data.type == 2) 
                        return '<span class="hotel-header">' + r.data.hotel_name + '</span>'
                    return (r.data.type_name == r.data.room? '':r.data.type_name)
                }
            },{
                text: D.t('Room'),
                width: 105,
                resizable: false,
                dataIndex: 'room',
                menuDisabled: true,
                sortable: false
            }]
    }
    
    
    ,rebuildColumns: function(date, days) {
        var me = this
            ,cols = me.buildMainColumns()
            ,w = 0;
        
        if(!date && !me.startDate) date = new Date();
        
        if(date) me.startDate = me.calculateStartDate(date)
        
        if(!days) days = me.defaultDays;
        else me.defaultDays = days
            
        for(var i=0;i<cols.length;i++)
            w += cols[i].width;
        w = me.getWidth() - w;
        cols = cols.concat(me.buildDayColumns(me.startDate, days, w))
        me.cleanBookings()
        me.noCollapseLog = true
        me.reconfigure(null, cols)
        setTimeout(function() {
            me.noCollapseLog = false;
        }, 500)
        me.addMousemoveEvent()
        me.getBookings(true)
    }
    
    ,calculateStartDate: function(date) {
        return new Date(Ext.Date.format(date, 'm/d/Y'))
    }
    
    ,getBookings: function(noclean) {
        if(!this.records) return;
        var me = this
            ,date = me.calculateStartDate(me.startDate)
            ,days = me.defaultDays;
    
        me.model.getBookings(null, date, days, function(data) {
            me.placeBookings(data, !noclean)    
        })
             
    }
    
    ,cleanBookings: function(commit) {
        while(this.body.dom.firstChild.children[1])
            this.body.dom.firstChild.removeChild(this.body.dom.firstChild.children[1])
    }
       
    ,placeBookings: function(data, clean) {
        var me = this,i,j;
        if(clean) {
            me.cleanBookings()
        }
       
        for(i=0;i<data.length;i++) {
            for(j=0;j<data[i].rooms.length;j++) {
                me.placeMarker({
                    _id: data[i]._id, 
                    res_num: data[i].res_num,
                    key: data[i].rooms[j].hotel + ':' + data[i].rooms[j].room,
                    date1: new Date(data[i].rooms[j].date1), 
                    date2: new Date(data[i].rooms[j].date2), 
                    title: data[i].client_name,
                    notes: me.createNotes(data[i], data[i].rooms[j]),
                    status: data[i].status,
                    conflict: data[i].rooms[j].conflict 
                }, {
                    cls: 'bline',
                    id: data[i]._id,
                    tpl: me.bookTpl,
                    handler: function() {
                        if(!me.bookingClickLog) {
                            me.bookingClickLog = true;
                            me.fireEvent('bookingclick', this.id);
                            event.stopPropagation()
                            setTimeout(function() {me.bookingClickLog = false;}, 500)
                        }
                        return false;
                    }
                })
            }
        }
    }
            
    ,createNotes: function(data, item) {
        var out = []
        if(item.guests) out.push('adults: ' + item.guests)
        if(item.kid) out.push('kids: ' + item.kid)
        if(item.cot) out.push('cot: ' + item.cot)
        out = out.join('; ')
        if(!out && data.notes) out = data.notes;
        return out;
    }
    
    ,addMousemoveEvent: function() {
        var me = this;
        setTimeout(function() {
            if(!me.body) {
                me.addMousemoveEvent()
                return;
            }
            var elm = me.body.query('.calcell')
            for(var i=0;i<elm.length;i++) {
                elm[i].onmousemove = function() {me.contMouseOver(this)}    
            }
        }, 500)
    }
    
    ,buildDayColumns: function(startDate, days, width) {
        var me = this
            ,w = parseInt(width/days)
            ,columns = []
            ,dt,md
            ,mm
            ,dcols
            ,i = 0
            ,iCol
            ,start = startDate.getTime();
        
        dt =  new Date(start);
         
        me.currentDayWidth = w
        me.currentDayCount = days
        me.currentDateStart = startDate;
        me.currentDateEnd = new Date(start + days*86400000);
        
        mm = Ext.Date.format(dt, 'F')
        while(i<days) {
            dcols = []
            while(i<days && Ext.Date.format(dt, 'F') == mm) {
                dcols.push({
                    text: '<span' + (['6','7'].indexOf(Ext.Date.format(dt, 'N'))!=-1? ' class="weekend"':'') + '>' + Ext.Date.format(dt, 'd') + '</span>',
                    width: w,
                    resizable: false,
                    menuDisabled: true,
                    sortable: false,
                    renderer: function(v,m, r, i, c) {
                        if(r.data.status==1) m.tdCls='calcell';
                    }
                })
                start += 86400000
                dt =  new Date(start);
                i++;
            }
            columns.push({
                text: '<strong>' + D.t(mm) + '</strong>',
                columns: dcols
            })
            mm = Ext.Date.format(dt, 'F')
        }
        return columns
    }
    
    ,getColorClass: function(color) {
        var className = 'bline' + color;
        if(!Ext.util.CSS.getRule('.' + className))
            Ext.util.CSS.createStyleSheet(
            '.' + className + '{background-color: #' + color + '}' +
            '.' + className + ':after {border-left-color: #' + color + '}' +
            '.' + className + ':before {border-right-color: #' + color + '}'
            )
        return className;
    }
    
    
    
    ,cellMouseDown: function(th, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        if(/calcell/.test(td.className)) {
            
            if(e.target.className.substr(0,17)=='front-desk-marker') {
               this.movedTarget = e.target
            } else {
                this.startIndex = [cellIndex, rowIndex]
                this.endIndex = [cellIndex, rowIndex]
            }
            this.firstNode = record
        }
    }
    
    ,getNodesBySegment: function(one, two) {
        var rooms = [one]
        if(one == two)
                return rooms
        while(one.nextSibling) {
             one = one.nextSibling
             if(one.data.status == 1) 
                rooms.push(one)
             if(one == two)
                return rooms
        }
        return null;        
    }
    
    ,cellMouseUp: function(th, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        if(this.movedTarget) delete this.movedTarget
        if(!this.startIndex || !this.endIndex) return;
        var startTime = this.startDate.getTime()
            ,startDate = new Date(startTime + 86400000*(this.startIndex[0]-2))
            ,endDate = new Date(startTime + 86400000*(this.endIndex[0]-2))
            ,rooms = this.getNodesBySegment(this.firstNode, record)
        
        if(endDate+'' != startDate+'') {
            if(!rooms) {
                rooms = this.getNodesBySegment(record, this.firstNode)
            }
            if(endDate<startDate) {
                this.fireEvent('selectrange', rooms, endDate, startDate);
            } else {
                this.fireEvent('selectrange', rooms, startDate, endDate);
            }
        }
        this.cleanSelection()
        this.startIndex = null
        this.endIndex = null
        
    }
    
    ,contMouseOver: function(th) {
        if(this.movedTarget) {
            if(this.movedTarget.parentNode != th) th.appendChild(this.movedTarget)
        } else
        if(this.endIndex && this.endIndex[0] != th.cellIndex) {
            this.endIndex[0] = th.cellIndex
            this.buildSelectedArea()
        } 
    }
    
    ,fixItemOver: function(indx) {
        if(this.endIndex && this.endIndex[1] != indx) {
            this.endIndex[1] = indx    
            this.buildSelectedArea()
        }
    }
    
    ,cleanSelection: function() {
        var elm = this.body.query('.sel-cell')
        for(var i=0;i<elm.length;i++) {
            elm[i].className = elm[i].className.replace(' sel-cell','')    
        }
    }
    
    ,buildSelectedArea: function() {
        this.cleanSelection();
        this.getSelectionModel().deselectAll()
        var rows = this.body.query('tbody')[0].children;
        var x0, y0, x1, y1;
        if(this.startIndex[0]<this.endIndex[0]) {
            x0 = this.startIndex[0]
            x1 = this.endIndex[0]
        } else {
            x1 = this.startIndex[0]
            x0 = this.endIndex[0]
        }
        
        if(this.startIndex[1]<this.endIndex[1]) {
            y0 = this.startIndex[1]
            y1 = this.endIndex[1]
        } else {
            y1 = this.startIndex[1]
            y0 = this.endIndex[1]
        }
        for(var i=y0;i<=y1;i++) {
            for(var j=x0;j<=x1;j++) {
                if(/calcell/.test(rows[i].children[j].className))
                    rows[i].children[j].className += ' sel-cell'
            }
        }
    }
    ,buildButtons: function() {
        return null;
    }
    
    ,nodeSetState: function(_id, exp) {
        if(me.noSetState) return;
        /* save code hrere */
    }
    
    ,checkExpandedRecs: function(recs) {
        var me = this;
        me.noSetState = true;
        var f = function(i) {
            if(i>=recs.length) {
                me.noSetState = false;
                return;
            }
            if(me.nodeGetState(recs[i].data._id))
                me.expandNode(recs[i], false, function() {
                    f(i+1)    
                })
            else
                f(i+1) 
        }
        f(0)
    }
    
    ,nodeGetState: function(_id, exp) {
        return true;
    }
    
    ,showMarkers: function(outStr, markers, day) {
        if(markers) {
            markers.forEach(function(m) {
                if(m.day == day)
                    outStr += '<a href="#" class="front-desk-marker '+m.type+'" title="'+D.t(m.type)+'"></a>'
            })
                
        }
        return outStr;
    }
    
    ,placeMarkers: function(markersArg, cb) {
     
    }
    
    ,hideMarkers: function(cb) {
        this.placeMarkers(null,cb)
    }
    
    ,placeMarker: function(data, cfg) {
        var me = this
            ,leftConer = true
            ,rightConer = true
            ,strNum
            ,dayNum
            ,daysCnt
            ,w
            ,classes = [cfg.cls];
        
        if(data.date1 < me.currentDateStart) 
            data.date1 = new Date(me.currentDateStart.getTime() - 86400000)
        else
            classes.push('larrow');
            
        if(data.date2 > me.currentDateEnd) 
            data.date2 = me.currentDateEnd
        else    
            classes.push('rarrow');
        if(!me.records[data.key]) return;
        
        strNum = me.records[data.key].index
        dayNum = parseInt((data.date1.getTime() - me.currentDateStart.getTime())/86400000) + 1;
        daysCnt = parseInt((data.date2.getTime() - me.currentDateStart.getTime())/86400000) - dayNum;
        
        if(data.color) {
            classes.push(me.getColorClass(data.color))
        } else
        if(!!me.getColorByStatus) {
            classes.push(me.getColorClass(me.getColorByStatus(data)))
        }
        
        var div = document.createElement('a');
        div.className = classes.join(' ')
        div.style.position = 'absolute';
        div.style.top = ((me.lineHeight+2)*strNum) + 'px';
        div.style.left = (210 + dayNum*me.currentDayWidth) +'px';
        div.style.width = daysCnt*me.currentDayWidth + 'px'
        div.style.zIndex = 1000;
        div.innerHTML = cfg.tpl.apply(data);
        div.onclick = cfg.handler
        if(cfg.id) div.id = cfg.id;
        this.body.dom.firstChild.appendChild(div);    
    }

    
});