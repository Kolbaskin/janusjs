<tpl if="total">
    <tpl for="list">
        <h4>
            <a href="/news/{_id}">{name}</a> 
            <i class="date">Дата: {[Ext.Date.format(new Date(values.date_start),'d.m.Y')]}</i>
        </h4>
        <p>{stext}</p>
    </tpl>
</tpl>
