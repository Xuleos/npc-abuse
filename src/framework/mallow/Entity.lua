local Entity = {}
Entity.__index = Entity

function Entity.new(identifier, core)
    local self = {
        Instance = identifier,
        _core = core
    }

    return setmetatable(self, Entity)
end

function Entity:getComponent(ComponentConstructor)
    local componentList = self._core.Components[ComponentConstructor.Tag]

    if (not componentList) then
        return warn("Could not find component list for "..ComponentConstructor.Tag)
    end

    if componentList[self.Instance] then
        return componentList[self.Instance]
    else
        return warn("Could not find "..ComponentConstructor.Tag.." Instance on this entity")
    end
end

function Entity:hasComponent(componentConstructor)
    local componentList = self._core.Components[componentConstructor.Tag]

    return componentList[self.Instance] ~= nil
end

function Entity:removeComponent(component)
    self._core:_removeComponentFromEntity(self.Instance, component.Tag, component)
end

function Entity:addComponent(component)
    return self._core:_addComponentToEntity(self.Instance, component.Tag, component)
end

return Entity
