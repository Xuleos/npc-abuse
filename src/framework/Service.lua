local Service = {}
Service.__index = Service

function Service.new(...)
    local self = setmetatable({}, Service)
    self:constructor(...);
    return self
end

function Service:constructor(...)
end

return Service