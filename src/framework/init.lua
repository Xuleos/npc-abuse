local Mallow = require(script.mallow)
local Query = require(script.mallow.Query)

local inst = Mallow.new()

local Framework = {
    ServerSystem = require(script.System),
    ClientSystem = require(script.System),
    SharedSystem = require(script.System),
    Component = require(script.mallow.Component),
    Query = {
        new = function(components)
            return Query.new(inst, components)
        end
    },
    mallow = inst,
    RemoteProperty = require(script.RemoteProperty),
    ServerSystems = {},
    ClientSystems = {}
}

return Framework
