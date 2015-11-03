<!DOCTYPE HTML>
<html>
    <head>
    <title>{[values.metatitle? values.metatitle:values.name]}</title>
    </head>
<body>
    <tpl if="blocks && blocks[1]">
        <tpl for="blocks[1]">{.}</tpl>
    </tpl>  
</body>
</html>