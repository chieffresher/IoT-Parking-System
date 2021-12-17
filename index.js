let resources = require("./resources.json");
let slot_proc = require("./slot_processor.js");
let _ = require("underscore");

_.each(resources.slots,(slot)=>{slot_proc.process(slot); });

