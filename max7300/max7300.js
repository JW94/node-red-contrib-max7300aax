module.exports = function(RED) {
    var max7300 = require('max7300');
    
    
    function initMax7300(config) 
    {
        RED.nodes.createNode(this,config);
        var node = this;
        var globalContext = this.context().global;
        this.status({fill:"orange",shape:"ring",text:"Not Initialised"});
        this.on('input', function(msg) {
            this.max = new max7300('/dev/i2c-2', 0x40);
            globalContext.set("i2cMax",this.max);
            globalContext.set("initMax",true);
            if(globalContext.initMax)
            {
                this.status({fill:"green",shape:"dot",text:"Initialised"});
            }
            else
            {
                
                this.status({fill:"red",shape:"ring",text:"Not Initialised"});
            }
            node.send(null);
        });
    }
    RED.nodes.registerType("max7300init",initMax7300);
    
// ###############################################################################################################
    
    function modeMax7300(config) {
        RED.nodes.createNode(this,config);
        this.mode = parseInt(config.mode);
        var node = this;
        var globalContext = this.context().global;
        this.status({fill:"yellow",shape:"ring",text:"initialisiert"});
        this.on('input', function(msg) {
            if(globalContext.initMax)
            {
                this.status({fill:"green",shape:"dot",text:"?"});
                if(!(node.mode))
                {
                    globalContext.i2cMax.setModeMax7300(parseInt(msg.payload),function(err)
                    {
                        if(err)
                        {
                            msg.payload = err;
                            node.warn(msg);
                        }
                        node.send(null);
                    });
                }
                else
                {
                    globalContext.i2cMax.getModeMax7300(function(data)
                    {
                        msg.payload = data;
                        node.send(msg);
                    });
                }
            }
            else
            {
                node.warn("I2C nicht initialisiert");
                msg=null;
                node.send(msg);
            }
        });
    }
    RED.nodes.registerType("max7300mode",modeMax7300);
    
// ###############################################################################################################

    function statemax7300(config) {
        RED.nodes.createNode(this,config);
        this.mode = parseInt(config.mode);
        this.pin = parseInt(config.pin);
        var node = this;
        var globalContext = this.context().global;
        this.on('input', function(msg) {
            if(globalContext.initMax)
            {                
                this.status({fill:"green",shape:"dot",text:"?"});
                if(!(node.mode))
                {
                    globalContext.i2cMax.setStatePinMax7300(this.pin,parseInt(msg.payload),function(err)
                    {
                        if(err)
                        {
                            msg.payload = err;
                            node.warn(msg);
                        }
                        msg.payload = true;
                        node.send(msg);
                    });
                }
                else
                {
                    globalContext.i2cMax.getStateMax7300(this.pin,function(data)
                    {
                        msg.payload = data;
                        node.send(msg);
                    });
                }
            }
            else
            {
                node.warn("I2C nicht initialisiert");
                msg=null;
                node.send(msg);
            }
        });
    }
    RED.nodes.registerType("max7300States",statemax7300);
    
// ###############################################################################################################

    function confmax7300(config) {
        RED.nodes.createNode(this,config);
        this.mode = parseInt(config.mode);
        this.pin = parseInt(config.pin);
        var node = this;
        var globalContext = this.context().global;
        this.on('input', function(msg) {
            if(globalContext.initMax)
            {                
                if(!(node.mode))
                {
                    globalContext.i2cMax.setConfigPinMax7300(this.pin,parseInt(msg.payload),function(err)
                    {
                        if(err)
                        {
                            msg.payload = err;
                            node.warn(msg);
                        }
                        node.status({fill:"green",shape:"dot",text:msg.payload});
                        msg.payload = true;
                        node.send(msg);
                    });
                }
                else
                {
                    node.warn(this.pin);
                    globalContext.i2cMax.getConfigPinMax7300(this.pin,function(data)
                    {
                        node.status({fill:"green",shape:"dot",text:msg.payload});
                        msg.payload = data;
                        node.send(msg);
                    });
                }
            }
            else
            {
                node.warn("I2C nicht initialisiert");
                msg=null;
                node.send(msg);
            }
        });
    }
    RED.nodes.registerType("max7300ConfigPin",confmax7300);
}