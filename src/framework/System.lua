local System = {}
System.__index = System

function System.new(...)
    local self = setmetatable({}, System)
    self:constructor(...);
    return self
end

function System:constructor(...)
end

return System
