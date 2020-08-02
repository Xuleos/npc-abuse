local TS = require(game:GetService("ReplicatedStorage"):WaitForChild("rbxts_include"):WaitForChild("RuntimeLib"));
local Signal = TS.import(script, TS.getModule(script, "signal"));

local Query = {}
Query.__index = Query


function Query.new(...)
    local self = setmetatable({}, Query)
    self:constructor(...)

    self.resultAdded = Signal.new()
    self.resultRemoved = Signal.new()

    self.Cache = {}
    self.Valid = false

    return self
end

function Query:constructor(core, components)
    self._core = core
    self._OperatingComponents = components

    self._core:RegisterQuery(self)
end

function Query:fetchComponents()
    local results = {}

    local firstTag = self._OperatingComponents[1].Tag

    for entityId,_ in pairs(self._core.Components[firstTag]) do
        local valid = true
        
        for i = 1,#self._OperatingComponents do
            local tag = self._OperatingComponents[i].Tag

            if not self._core.Components[tag][entityId] then
                valid = false
                break
            end
        end

        if (valid == true) then
            table.insert(results, self._core.Entities[entityId])
        end
    end
    

    return results
end

function Query:getResults()
    --[[
        array of entities
    ]]

    if (self.Valid == false) then
        self.Cache = self:fetchComponents()
        
        self.Valid = true
    end

    return self.Cache
end;

return Query