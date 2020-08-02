local Mallow = require(script.mallow)
local Query = require(script.mallow.Query)

local inst = Mallow.new()

local Framework = {
    ServerSystem = require(script.Service),
    ClientSystem = require(script.Service),
    SharedSystem = require(script.Service),
    Component = require(script.mallow.Component),
    Query = {
        new = function(components)
            return Query.new(inst, components)
        end
    },
    mallow = inst,
    ServerSystems = {},
    ClientSystems = {}
}

return Framework
